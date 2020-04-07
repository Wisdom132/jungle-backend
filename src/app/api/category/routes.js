require("./model");
const categoryController = require("./controller");
const router = require("express").Router();

router.post("/create-category", categoryController.createCategory);
router.get("/get-categories", categoryController.getAllCategory);
router.delete("/remove-category/:id", categoryController.removeCategory)
router.put("/edit-category/:id", categoryController.editCategory)


module.exports = router;