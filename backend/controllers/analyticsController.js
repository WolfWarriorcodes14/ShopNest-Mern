const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");  

const getAdminAnalytics = async(req,res) => {
    try{
        const totalOrders = await Order.countDocuments({});
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalproducts = await Product.countDocuments({});

        const orders = await Order.find({});    
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.json({
            totalRevenue,
            totalOrders,
            totalUsers,
            totalproducts
        });
    } catch(error){
        res.status(500).json({message: 'Server error'})
    }
};
module.exports = { getAdminAnalytics };