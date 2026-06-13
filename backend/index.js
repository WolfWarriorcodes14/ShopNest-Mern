const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/orders', require("./routes/orderRoutes.js"));
app.use('/api/payments', require("./routes/paymentRoutes.js"));
app.use('/api/analytics', require("./routes/analyticsRoutes"));

// Root API check
app.get("/api", (req, res) => {
  res.send("Wolf-ShoppingBasket Backend Is Working Properly...");
});

// Serve React build only if it exists
const buildPath = path.join(__dirname, "../frontend/build");

app.use(express.static(buildPath));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Is Running on port ${PORT}`);
});