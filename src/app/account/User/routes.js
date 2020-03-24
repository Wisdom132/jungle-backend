require("./model");
const userController = require("./controller");
const router = require( "express" ).Router();

router.post("/register-user",userController.createNewUser)

module.exports = router;
