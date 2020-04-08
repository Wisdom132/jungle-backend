const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    image: {
        type: String
    },
    discount_price: {
        type: Number,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("Product", productSchema);