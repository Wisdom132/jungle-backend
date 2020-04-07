// const User = require("../../account/User/model")
const Resturant = require("./model");
const token = require("../../../utilities/tokenGen")
const mailer = require("../../../utilities/mailer")
const Token = require("../../account/Token/model")
const paginator = require("express-mongo-paginator");
const cloudinary = require("../../../utilities/cloudinary")
// const paginator = require("../../../utilities/paginator")


exports.createResturant = async (req, res) => {
    try {
        let resturant = new Resturant({
            userId: req.body.userId,
            resturant_name: req.body.resturant_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            location: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state
            }
        })
        let generatedToken = await token.genResturantToken(req.body.email);
        let addAction = await resturant.save();
        if (addAction) {
            mailer.confirmResturant(req.body.email, generatedToken.token)
        }
        res.status(200).json({
            msg: "Please Verify Your Email",
            data: addAction
        })

    } catch (err) {
        console.log()
        res.status(500).json({
            error: err
        })
    }
}

exports.confirmResturant = async (req, res) => {
    try {
        let userToken = await Token.findOne({
            token: req.params.token
        });
        let resturant = await Resturant.findOne({
            email: userToken.resturantEmail
        })

        //check if its a valid token
        if (!userToken) {
            res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find a valid token. Your token my have expired."
            })
        }

        if (!resturant) {
            res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find a user for this token."
            })
        }
        if (resturant.isVerified) {
            res.status(400).json({
                type: "Already Verified",
                msg: "This Resturant has already been verified."
            })
        }
        resturant.isVerified = true;
        let verifiedResturant = await resturant.save();
        res.status(200).json({
            type: "Resturant Verified",
            msg: "Your Resturant has been successfully verified "
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
        let resturant = await Resturant.findOne({
            email: req.body.email
        })

        if (!resturant) {
            res.status(400).json({
                type: "Not Found",
                mes: "No Resturant with this email was found.Please Create a Resturant"
            })
        }
        if (resturant.isVerified) {
            res.status(400).send({
                type: "Already Verified",
                msg: "This Resturant has already been verified. Please login with user info."
            });
        }
        res.status(200).json({
            type: "Email Sent",
            msg: "Verification Email Sent"
        })

        let generatedToken = await token.genResturantToken(req.body.email);
        mailer.confirmResturant(resturant.email, generatedToken.token)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.getAllResturant = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let data = await paginator.paginator(Resturant, page, 2, [{
            resturant_name: req.query.name
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

exports.activateResturant = async (req, res) => {
    try {
        let resturant = await Resturant.findOne({
            _id: req.body.id
        });
        resturant.isActivated = req.body.status;
        await resturant.save();
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