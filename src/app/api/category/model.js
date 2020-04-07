const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model("Category", categorySchema);
categorySchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});