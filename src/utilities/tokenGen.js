const Token = require("../app/account/Token/model");
const crypto = require("crypto");

let genToken = async (userEmail) => {
    let token = new Token({
        userEmail: userEmail,
        token: await crypto.randomBytes(16).toString("hex")
    })

    let succesToken = await token.save();

    return succesToken
}

let genRestaurantToken = async (restaurantEmail) => {
    let token = new Token({
        restaurantEmail: restaurantEmail,
        token: await crypto.randomBytes(16).toString("hex")
    })

    let succesToken = await token.save();

    return succesToken
}

let generateRandomToken = async () => {
    let ranToken = await crypto.randomBytes(16).toString("hex");
    return ranToken
}

module.exports = {
    genToken,
    generateRandomToken,
    genRestaurantToken
};