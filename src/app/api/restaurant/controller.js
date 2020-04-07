// const User = require("../../account/User/model")
const Restaurant = require("./model");
const token = require("../../../utilities/tokenGen")
const mailer = require("../../../utilities/mailer")
const Token = require("../../account/Token/model")
const paginator = require("express-mongo-paginator");
const cloudinary = require("../../../utilities/cloudinary")
// const paginator = require("../../../utilities/paginator")


exports.createRestaurant = async (req, res) => {
    try {
        let restaurant = new Restaurant({
            userId: req.body.userId,
            restaurant_name: req.body.restaurant_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            location: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state
            }
        })
        let generatedToken = await token.genRestaurantToken(req.body.email);
        let addAction = await restaurant.save();
        if (addAction) {
            mailer.confirmRestaurant(req.body.email, generatedToken.token)
        }
        res.status(200).json({
            msg: "Please Verify Your Email",
            data: addAction
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.confirmRestaurant = async (req, res) => {
    try {
        let userToken = await Token.findOne({
            token: req.params.token
        });
        let restaurant = await Restaurant.findOne({
            email: userToken.restaurantEmail
        })

        //check if its a valid token
        if (!userToken) {
            res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find a valid token. Your token my have expired."
            })
        }

        if (!restaurant) {
            res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find a user for this token."
            })
        }
        if (restaurant.isVerified) {
            res.status(400).json({
                type: "Already Verified",
                msg: "This restaurant has already been verified."
            })
        }
        restaurant.isVerified = true;
        await restaurant.save();
        res.status(200).json({
            type: "Restaurant Verified",
            msg: "Your Restaurant has been successfully verified "
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.resendConfirmation = async (req, res) => {
    try {
        let restaurant = await Restaurant.findOne({
            email: req.body.email
        })

        if (!restaurant) {
            res.status(400).json({
                type: "Not Found",
                mes: "No Restaurant with this email was found.Please Create a Restaurant"
            })
        }
        if (restaurant.isVerified) {
            res.status(400).send({
                type: "Already Verified",
                msg: "This Restaurant has already been verified. Please login with user info."
            });
        }
        res.status(200).json({
            type: "Email Sent",
            msg: "Verification Email Sent"
        })

        let generatedToken = await token.genRestaurantToken(req.body.email);
        mailer.confirmRestaurant(restaurant.email, generatedToken.token)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.getAllRestaurant = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let data = await paginator.paginator(Restaurant, page, 2, [{
            restaurant_name: req.query.name
        }]);

        res.status(200).json({
            data
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.activateRestaurant = async (req, res) => {
    try {
        let restaurant = await Restaurant.findOne({
            _id: req.body.id
        });
        if (!restaurant.isVerified) {
            return res.status(400).json({
                type: "Action Denied",
                msg: "Restaurant Has to be verified First"
            })
        }
        if (!restaurant) {
            return res.status(400).json({
                type: "Not Found",
                msg: "Resturant Not Found"
            })
        }
        restaurant.isActivated = req.body.status;
        await restaurant.save();
        res.status(200).json({
            type: "Action Successful",
            msg: "Status Updated"
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}