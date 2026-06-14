const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');    

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

const registerUser = async(req,res)=>{
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists...'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const otp = Math.floor(100000+Math.random()*900000).toString();
        const user = new User({ name,email,password: hashedPassword, otp, otpExpires: Date.now() + 3600000 });
            await user.save();
        if(user){            
            const message = 
            `Welcome to Wolf-ShoppingBasket, ${name}!!...
            Thank You for registering with us. We are excited to have you as part of our community.
            To complete your registration enter the following OTP...  
            Your OTP for Wolf-ShoppingBasket is: ${otp}`;

            await sendEmail(email, 'Welcome to Wolf-ShoppingBasket - Your OTP for Registration',message);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch(error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
        message: error.message
    });
    }
}; 

    //Login User
    const loginUser = async(req,res) => {
        const {email, password} = req.body;
        try{
            const user = await User.findOne({email});
            if (user && !user.verified && user.role !== 'admin') {
                return res.status(401).json({ message: "Please verify your email first" });
            }
            if(user && (await bcrypt.compare(password, user.password))){
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                });
            }   else {                      
                res.status(400).json({message: 'Invalid email or password'});
            }
        } catch(error){
            res.status(500).json({message: 'Server error'})
        }      
    };

    const getUsers = async(req,res) => {
        try{
            const users = await User.find({});
            res.json(users);
        } catch(error){
            res.status(500).json({message: 'Server error'}).select('-password');
        }
    };

    const verifyOTP = async(req,res) => {
        const {email, otp} = req.body;
        try{
            const user = await User.findOne({email});
            if(user){
                if(user.otp === otp && user.otpExpires > Date.now()){
                    user.verified = true;
                    user.otp = undefined;
                    user.otpExpires = undefined;
                    await user.save();
                    res.json({message: 'Email verified successfully'});
                } else {
                    res.status(400).json({message: 'Invalid or expired OTP'});
                }
            } else {
                res.status(404).json({message: 'User not found'});
            }
        } catch(error){
            res.status(500).json({message: 'Server error'})
        }
    };

module.exports = { registerUser, loginUser, getUsers, verifyOTP };