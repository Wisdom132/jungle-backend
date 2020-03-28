const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true
    },
    phone_number: {
        type:String,
        required:true
    },
    email:{
         type:String,
         required:true,
         unique:true
    },
    isVerified: {
        type:Boolean,
        default:false,
    },
    username: { type: String, required: true },
    location:{
        street: {
        type:String,
        required:true
        },
        city:{
        type:String,
        required:true
        },
        state:{
        type:String,
        required:true
        }
    }
},
 {
    timestamps: true,
});


userSchema.methods.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
}

module.exports = mongoose.model( "User", userSchema );
userSchema.plugin(uniqueValidator,{ message: '{PATH} Already in use' });

