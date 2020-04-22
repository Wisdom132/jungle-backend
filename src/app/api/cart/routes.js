const cartController = require("./controllers");
const router = require("express").Router();

router.post("/add-item-to-cart", cartController.addItemToCart);
router.get("/get-cart", cartController.getUserCart);

module.exports = router