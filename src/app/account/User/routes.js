require("./model");
const userController = require("./controller");
const router = require("express").Router();

router.post("/register-user", userController.createNewUser);
router.get("/confirmation/:token", userController.confirmEmail);
router.post("/resend-email-verification", userController.resendEmail);
router.post("/login", userController.logUserIn)
module.exports = router;