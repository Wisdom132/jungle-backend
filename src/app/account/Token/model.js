const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema({
  userEmail: {
    type: String,

  },
  resturantEmail: {
    type: String,
  },
  token: {
    type: String,
    required: true
  },
}, {
  timestamp: true,
  expires: 43200
})


tokenSchema.methods.findUserToken = async (model, email, callback) => {
  const query = {
    userEmail: email
  }
  model.findOne(query, callback)
}

const Token = (module.exports = mongoose.model("Token", tokenSchema));