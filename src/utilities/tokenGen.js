const Token = require("../app/account/Token/model");
const crypto = require("crypto");

let genToken  =  async (userEmail) => {
let token = new Token({
    userEmail:userEmail,
    token: await crypto.randomBytes(16).toString("hex")
})

let succesToken = await token.save();

return succesToken
}

module.exports = {
 genToken   
};