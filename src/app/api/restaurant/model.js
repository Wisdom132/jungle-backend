const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


const restaurantSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    restaurant_name: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    location: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
restaurantSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});