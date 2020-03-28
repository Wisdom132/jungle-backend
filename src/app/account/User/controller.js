const User = require("./model");
const mailer = require("../../../utilities/mailer")
const Token = require("../Token/model")
const token = require("../../../utilities/tokenGen")

//create new user and send mail to the user
exports.createNewUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            username: req.body.username,
            location: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state
            }
        });
        user.password = await user.hashPassword(req.body.password);
        let generatedToken = await token.genToken(req.body.email);
        let addedUser = await user.save()
        if (addedUser) {
            mailer.confirmMail(req.body.email, generatedToken.token)
        }
        res.status(200).json({
            msg: "Please Verify Your Email",
            data: addedUser
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

//user confirm email
exports.confirmEmail = async (req, res) => {
    try {
        let userToken = await Token.findOne({
            token: req.params.token
        });
        let user = await User.findOne({
            email: userToken.userEmail
        })
        //check if its a valid token
        if (!userToken) {
            res.status(400).json({
                type: "Not Verified",
                msg: "We were unable to find a valid token. Your token my have expired."
            })
        }
        if (!user) {
            res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find a user for this token."
            })
        }
        if (user.isVerified) {
            res.status(400).json({
                type: "Already Verified",
                msg: "This user has already been verified."
            })
        }

        user.isVerified = true;
        let userInfoUpdated = await user.save();
        res.status(200).json({
            type: "User Verified",
            msg: "YOur Account has been verified successfully"
        })

    } catch (err) {
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
}

exports.resendEmail = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(400).json({
                type: "Not Found",
                mes: "No user with this email was found.Please Create an account"
            })
        }
        if (user.isVerified) {
            res.status(400).send({
                type: "Already Verified",
                msg: "This account has already been verified. Please login."
            });
        }
        res.status(200).json({
            type: "Email Sent",
            msg: "Verification Email Sent"
        })

        let generatedToken = await token.genToken(req.body.email);
        mailer.confirmMail(req.body.email, generatedToken.token)
    } catch (err) {
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
}

exports.logUserIn = async (req, res) => {
    const login = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        let user = await User.findOne({
            email: login.email
        });
        if (!user) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }
        if (!user.isVerified) {
            res.status(400).json({
                type: "Not Verified",
                msg: "Your Account has not been verified"
            })
        }
        let match = await user.compareUserPassword(login.password, user.password);
        if (match) {
            let token = await user.generateJwtToken({
                user
            }, "secret", {
                expiresIn: 604800
            })

            if (token) {
                res.status(200).json({
                    success: true,
                    token: token,
                    userCredentials: user
                })
            }
        } else {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }



    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
}