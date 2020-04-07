require("./model");
const restaurantController = require("./controller");
const router = require("express").Router();

router.post("/register-restaurant", restaurantController.createRestaurant);
router.get("/confirmation/:token", restaurantController.confirmRestaurant);
router.post("/resend-confirmation", restaurantController.resendConfirmation);
router.get("/list-restaurants/:page/", restaurantController.getAllRestaurant);
router.post("/update-status", restaurantController.activateRestaurant)

module.exports = router;