const cartController = require("./controllers");
const router = require("express").Router();

router.post("/add-item-to-cart", cartController.addItemToCart);
router.post("/subtract-item-to-cart", cartController.subtractItem);
router.get("/get-cart", cartController.getUserCart);
router.post("/empty-cart", cartController.emptyCart);

module.exports = router