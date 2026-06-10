const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

const connectDB = require("./config/db");
const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dotenv.config({ path: path.join(__dirname, ".env") });

const productData = [
    {
        name: "Wireless Bluetooth Headphones",
        description: "Comfortable over-ear headphones with deep bass and long battery life.",
        price: 2499,
        category: "Electronics",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        ratings: 4.5,
        numReviews: 18
    },
    {
        name: "Smart Fitness Watch",
        description: "Track steps, heart rate, workouts, and notifications from your wrist.",
        price: 3499,
        category: "Wearables",
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ratings: 4.2,
        numReviews: 12
    },
    {
        name: "Classic Cotton T-Shirt",
        description: "Soft everyday cotton t-shirt with a regular fit.",
        price: 599,
        category: "Fashion",
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        ratings: 4.1,
        numReviews: 35
    },
    {
        name: "Ceramic Coffee Mug",
        description: "Minimal ceramic mug for coffee, tea, and hot chocolate.",
        price: 299,
        category: "Home",
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
        ratings: 4.7,
        numReviews: 24
    },
    {
        name: "Running Sports Shoes",
        description: "Lightweight running shoes with cushioned soles for daily training.",
        price: 2199,
        category: "Footwear",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        ratings: 4.4,
        numReviews: 21
    },
    {
        name: "Laptop Backpack",
        description: "Water-resistant backpack with laptop sleeve and organizer pockets.",
        price: 1299,
        category: "Bags",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        ratings: 4.3,
        numReviews: 16
    }
];

const userData = [
    {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: "admin123",
        role: "admin",
        verified: true
    },
    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: "user123",
        role: "user",
        verified: true
    },
    {
        name: "Priya Patel",
        email: "priya@example.com",
        password: "user123",
        role: "user",
        verified: true
    }
];

const buildOrder = (user, products, status, paymentId, createdAt) => {
    const orderProducts = products.map(({ product, quantity }) => ({
        product: product._id,
        quantity
    }));

    const subtotal = products.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);
    const taxprice = Math.round(subtotal * 0.18);

    return {
        user: user._id,
        products: orderProducts,
        taxprice,
        totalPrice: subtotal + taxprice,
        shippingAddress: {
            fullName: user.name,
            street: "42 Market Road",
            city: "Ahmedabad",
            postalCode: "380001",
            country: "India"
        },
        paymentId,
        status,
        createdAt
    };
};

const seedData = async () => {
    try {
        await connectDB();

        const seedEmails = userData.map((user) => user.email);
        const seedProductNames = productData.map((product) => product.name);
        const seedPaymentIds = ["seed_pay_001", "seed_pay_002", "seed_pay_003"];

        await Order.deleteMany({ paymentId: { $in: seedPaymentIds } });
        await Product.deleteMany({ name: { $in: seedProductNames } });
        await User.deleteMany({ email: { $in: seedEmails } });

        const hashedUsers = await Promise.all(
            userData.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );

        const createdUsers = await User.insertMany(hashedUsers);
        const createdProducts = await Product.insertMany(productData);

        const admin = createdUsers.find((user) => user.role === "admin");
        const rahul = createdUsers.find((user) => user.email === "rahul@example.com");
        const priya = createdUsers.find((user) => user.email === "priya@example.com");

        const orders = [
            buildOrder(
                rahul,
                [
                    { product: createdProducts[0], quantity: 1 },
                    { product: createdProducts[3], quantity: 2 }
                ],
                "delivered",
                "seed_pay_001",
                new Date("2026-05-18")
            ),
            buildOrder(
                priya,
                [
                    { product: createdProducts[1], quantity: 1 },
                    { product: createdProducts[2], quantity: 3 }
                ],
                "shipped",
                "seed_pay_002",
                new Date("2026-06-02")
            ),
            buildOrder(
                admin,
                [
                    { product: createdProducts[4], quantity: 1 },
                    { product: createdProducts[5], quantity: 1 }
                ],
                "pending",
                "seed_pay_003",
                new Date("2026-06-08")
            )
        ];

        await Order.insertMany(orders);

        console.log("Dummy data seeded successfully.");
        console.log(`Users: ${createdUsers.length}`);
        console.log(`Products: ${createdProducts.length}`);
        console.log(`Orders: ${orders.length}`);
        console.log("Login examples:");
        console.log("Admin: admin@shopnest.com / admin123");
        console.log("User: rahul@example.com / user123");
        console.log("User: priya@example.com / user123");
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedData();
