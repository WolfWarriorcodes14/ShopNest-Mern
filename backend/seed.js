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
    },
    {
    name: "Gaming Mouse",
    description: "RGB gaming mouse with adjustable DPI and ergonomic design.",
    price: 1499,
    category: "Electronics",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ratings: 4.6,
    numReviews: 28
},
{
    name: "Mechanical Keyboard",
    description: "Blue switch mechanical keyboard with RGB lighting.",
    price: 2999,
    category: "Electronics",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
    ratings: 4.7,
    numReviews: 41
},
{
    name: "Wireless Earbuds",
    description: "Noise-isolating earbuds with fast charging support.",
    price: 1999,
    category: "Electronics",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    ratings: 4.4,
    numReviews: 33
},
{
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 6999,
    category: "Furniture",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800",
    ratings: 4.5,
    numReviews: 19
},
{
    name: "Study Table",
    description: "Modern wooden study table suitable for home office.",
    price: 4999,
    category: "Furniture",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    ratings: 4.2,
    numReviews: 14
},
{
    name: "Samsung Galaxy M35",
    description: "5G smartphone with AMOLED display and long battery life.",
    price: 18999,
    category: "Mobiles",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    ratings: 4.6,
    numReviews: 52
},
{
    name: "Apple iPhone 15",
    description: "Powerful smartphone with advanced camera system.",
    price: 69999,
    category: "Mobiles",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    ratings: 4.8,
    numReviews: 89
},
{
    name: "Dell Inspiron Laptop",
    description: "15.6-inch laptop with Intel processor and SSD storage.",
    price: 54999,
    category: "Computers",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ratings: 4.5,
    numReviews: 25
},
{
    name: "Water Bottle",
    description: "Stainless steel insulated water bottle.",
    price: 499,
    category: "Home",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    ratings: 4.3,
    numReviews: 17
},
{
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with powerful sound.",
    price: 2499,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
    ratings: 4.4,
    numReviews: 22
},
{
    name: "Men's Denim Jacket",
    description: "Stylish slim-fit denim jacket for casual wear.",
    price: 1799,
    category: "Fashion",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    ratings: 4.3,
    numReviews: 31
},
{
    name: "Women's Handbag",
    description: "Premium handbag with spacious compartments.",
    price: 2199,
    category: "Fashion",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    ratings: 4.5,
    numReviews: 29
}
];

const userData = [
    {
        name: "Admin User",
        email: "admin@wolf-shoppong-basket.com",
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
        console.log("Admin: admin@wolf-shoppong-basket.com / admin123");
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
