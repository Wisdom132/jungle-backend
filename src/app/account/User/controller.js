const User = require("./model");
const mailer = require("../../../utilities/mailer")
const Token = require("../Token/model")
const bcrypt = require("bcrypt")
const token = require("../../../utilities/tokenGen")
const paginator = require("../../../utilities/paginator")
const mapper = require("../../../config/googlemaps")



var geocodeParams = {
    "address": "100 unit estate,unit 90 udoudoma avenue,uyo Nigeria",
    // "components": "components=country:GB",
    // "bounds": "55,-1|54,1",
    // "language": "en",
    // "region": "uk"
};



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
        //check if user exit
        if (!user) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }
        // check validity of user 
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
exports.forgotpassword = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(400).json({
                type: "User Not Found",
                msg: "User with this email not found"
            })
        }
        if (!user.isVerified) {
            res.status(400).json({
                type: "USER NOT VERIFIED",
                msg: "Please Verify Your Account"
            })
        }
        if (user) {
            let returnedUser = await User.findByIdAndUpdate(
                user._id, {
                    $set: {
                        resetPasswordToken: await token.generateRandomToken(),
                        resetPasswordExpirationDate: Date.now() + 86400000
                    },

                }, {
                    new: true
                })
            if (returnedUser) {
                mailer.forgotPassword(returnedUser.email, returnedUser.resetPasswordToken)
            }
            res.json({
                type: "Mail Sent!",
                msg: "Confirm Password Reset"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Not Found",

            msg: "Something Went Wromg"
        })
    }
}
exports.resetPassword = async (req, res) => {
    let newPassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;
    try {
        let user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpirationDate: {
                $gt: Date.now()
            }
        })
        if (!user) {
            res.status(400).json({
                type: "Token Expired",
                msg: "Error,Token Expired"
            })
        }
        if (user) {
            if (newPassword === confirmpassword) {
                user.password = await bcrypt.hashSync(newPassword, 10);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpirationDate = undefined;
                let newUserDetails = await user.save();

                if (newUserDetails) {
                    mailer.resetConfirmation(user.email)
                }
                res.status(200).json({
                    type: "Success",
                    msg: "Password Reset Successfully",
                })

            } else {
                res.status(400).json({
                    type: "Error",
                    msg: "Password does not match"
                })
            }

        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Not Found",
            msg: "Something Went Wrong"
        })
    }
}
exports.changePassword = async (req, res) => {
    let oldpassword = req.body.password
    let newPassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (user) {
            let match = await user.compareUserPassword(oldpassword, user.password);
            if (match) {
                if (newPassword === oldpassword) {
                    res.status(200).json({
                        type: "Success",
                        msg: "Please use a different password",
                    })
                }
                if (newPassword === confirmpassword) {
                    user.password = await bcrypt.hashSync(newPassword, 10);
                    let newChangedPassword = await user.save();
                    if (newChangedPassword) {
                        mailer.changePasswordConfirmation(user.email)
                    }

                    res.status(200).json({
                        type: "Success",
                        msg: "Password Changed Successfully",
                    })
                } else {
                    res.status(400).json({
                        type: "Error",
                        msg: "Password Does not match"
                    })
                }
            } else {
                res.status(400).json({
                    type: "Error",
                    msg: "Old Password is Incorrect"
                })
            }
        } else {
            res.status(400).json({
                type: "Error",
                msg: "User Not Found"
            })
        }


    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Error",
            msg: "Something Went Wrong"
        })
    }

}
exports.getAllUsers = async (req, res) => {
    try {
        mapper.gmAPI.geocode(geocodeParams, (err, data) => res.json(data))
        let page = req.params.page;
        let data = await paginator.paginator(User, page, 6);
        // res.status(200).json({
        //     data
        // })
    } catch (err) {
        res.json(err);
        console.log(err)
    }

}