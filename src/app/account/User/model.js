const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const jwt = require("express-jwt");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
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
    username: {
        type: String,
        required: true
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


userSchema.methods.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
}

userSchema.methods.compareUserPassword = async (inputtedPassword, hashedPassword) => {
    return await bcrypt.compare(inputtedPassword, hashedPassword)
}
userSchema.methods.generateJwtToken = async (payload, secret, expires) => {
    return jwt.sign(payload, secret, expires)
}

module.exports = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});