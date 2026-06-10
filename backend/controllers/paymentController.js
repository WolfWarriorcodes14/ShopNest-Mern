const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const createFakePayment = async (req, res) => {
    try {
        const amount = Number(req.body.amount || 0);

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid amount is required" });
        }

        const paymentId = "DEMO_" + crypto.randomBytes(6).toString("hex").toUpperCase();

        return res.status(200).json({
            success: true,
            message: "Fake payment completed successfully",
            paymentId,
            amount,
            currency: "INR",
            mode: "demo"
        });
    } catch (error) {
        console.error("Fake payment error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const createPaymentOrder = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay credentials are not configured" });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = Number(req.body.amount || 0);
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Valid amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(500).json({ message: "Error creating Razorpay order" });
        }

        return res.status(201).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            message: "Razorpay order created successfully"
        });
    } catch (error) {
        console.error("Razorpay order error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment verification data" });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay secret is not configured" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpay_signature)
        );

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            razorpay_order_id,
            razorpay_payment_id
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createPaymentOrder, verifyPayment, createFakePayment };