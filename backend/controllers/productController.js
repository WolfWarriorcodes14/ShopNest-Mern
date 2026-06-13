const productModel = require("../model/Product");
const cloudinary = require("../config/cloudinary"); 


//get all products with filters
const getProducts = async(req,res) => {
    try{
        const { category, minPrice, maxPrice } = req.query;
        let filter = {};

        // Add category filter if provided
        if(category && category !== 'all') {
            filter.category = category;
        }

        // Add price range filter if provided
        if(minPrice || maxPrice) {
            filter.price = {};
            if(minPrice) {
                filter.price.$gte = Number(minPrice);
            }
            if(maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const products = await productModel.find(filter);
        res.json(products);
    }
    catch(error){
        console.error("Error fetching products:", error.message);
        res.status(500).json({message: "Server Error"});
    }
};

//get product by id
const getProductById = async(req,res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(product){
            res.json(product);
        }
        else{
            res.status(404).json({message: "Product Not Found"});
        }
    }
    catch(error){
        console.error("Error fetching product:", error.message);
        res.status(500).json({message: "Server Error"});
    }
};

//create a new product
const createProduct = async(req,res) => {
   const { name, description, price, category, stock } = req.body;
   let imageUrl = '';  
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
    try{
        const product = new productModel({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
    catch(error){
        console.error("Error creating product:", error.message);
        res.status(500).json({message: "Server Error"});
    }
};

//update a product
const updateProduct = async(req,res) => {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = '';
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }
    try{
        const product = await productModel.findById(req.params.id);
        if(product){        
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if(req.file){
                product.imageUrl = imageUrl;
            } 
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message: "Product Not Found"});
        }
    }
    catch(error){
        console.error("Error updating product:", error.message);
        res.status(500).json({message: "Server Error"});
    }
};
//delete a product
const deleteProduct = async(req,res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message: "Product Removed"});
        }
        else{
            res.status(404).json({message: "Product Not Found"});
        }
    }
    catch(error){
        console.error("Error deleting product:", error.message);
        res.status(500).json({message: "Server Error"});
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };  