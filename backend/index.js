const express=require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

const app = express(); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.send("Wolf-ShoppingBasket Backend Is Working Properly...")
}); 

app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/orders', require("./routes/orderRoutes.js"));
app.use('/api/payments', require("./routes/paymentRoutes.js"));
app.use('/api/analytics', require("./routes/analyticsRoutes"));  

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server Is Running on port ${PORT}`);
})