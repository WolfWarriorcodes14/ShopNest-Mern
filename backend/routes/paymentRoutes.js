const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPaymentOrder, verifyPayment, createFakePayment } = require("../controllers/paymentController.js");

const router = express.Router();

router.post("/fake", createFakePayment);
router.post("/order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;