const productController = require("./controller");
const router = require("express").Router();

router.post("/add-product", productController.addNewProduct);
router.get("/get-products/:page", productController.getAllProducts);
router.put("/edit-product/:productId", productController.editProductDetails)
router.get("/product-details/:productId", productController.getProductDetails)
router.delete("/remove-product/:productId", productController.deleteProduct)

module.exports = router