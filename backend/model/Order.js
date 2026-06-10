const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type:Number,
                required: true,
                default:1
            }
        }
    ],
    taxprice:{
        type:Number,
        required: true
    },
    totalPrice:{
        type:Number,
        required: true
    },
    shippingAddress:{
        fullName:{
            type:String,
            required: true
        },
        street:{
            type:String,
            required: true
        },
        city:{
            type:String,
            required: true
        },
        postalCode:{
            type:String,
            required: true
        },
        country:{
            type:String,
            required: true
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    paymentId:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['pending','shipped','delivered','cancelled'],
        default:'pending'
    },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order; 