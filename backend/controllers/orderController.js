const express = require("express");
const Order = require("../model/Order");
const sendMail=require("../utils/sendEmail");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createOrder = async (req, res) => {
    const { products, shippingAddress, taxprice, totalPrice, paymentId } = req.body;

    try {
        const order = new Order({
            user: req.user._id,
            products,
            shippingAddress,
            taxprice,
            totalPrice,
            paymentId
        });
        const message = 
        `Dear ${req.user.name}, 
        Your order has been placed successfully!
        Order Details:
        Products: ${products.map(p => p.product).join(", ")}
        Total Price: $${totalPrice}
        Shipping Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}

        Thank you for shopping with us!
        Best regards,
        ShopNest Team`;
        const createdOrder = await order.save();
        await sendMail(req.user.email, "Your order has been placed successfully!", message);
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllOrdersByID = async (req, res) => {
    try {
        const order = await Order.find({}).populate('user', 'name email');
        res.json(order);
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order Not Found" });
        }
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};  

module.exports = { createOrder, getOrders, getAllOrdersByID, updateOrderStatus };
