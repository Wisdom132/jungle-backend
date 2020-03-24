const mongoose = require("mongoose");
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
    email:{
         type:String,
        required:true
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


userSchema.methods.hashPassword =  (password) => {
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.getUserByEmail = (model,email, callback) => {
  const query = {
    email: email
  };
 model.find(query, callback);
};

 module.exports = mongoose.model( "User", userSchema );



