const cartController = require("./controllers");
const router = require("express").Router();

router.post("/add-item-to-cart", cartController.addItemToCart);

module.exports = router