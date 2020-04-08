const productController = require("./controller");
const router = require("express").Router();

router.post("/add-product", productController.addNewProduct)

module.exports = router