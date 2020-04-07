require("./model");
const resturantController = require("./controller");
const router = require("express").Router();

router.post("/register-resturant", resturantController.createResturant);
router.get("/confirmation/:token", resturantController.confirmResturant);
router.post("/resend-confirmation", resturantController.resendConfirmation);
router.get("/list-resturants/:page/", resturantController.getAllResturant);
router.post("/update-status", resturantController.activateResturant)

module.exports = router;