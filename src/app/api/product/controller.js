const Product = require("./model");
const Category = require("../category/model")
const Restaurant = require("../restaurant/model")
// const paginator = require("../../../utilities/paginator")
const paginator = require("express-mongo-paginator");



exports.addNewProduct = async (req, res) => {
    try {
        let product = new Product({
            restaurantId: req.body.restaurantId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            categoryId: req.body.categoryId,
            discount_price: req.body.discount_price,
            isAvailable: req.body.isAvailable
        })

        let restaurant = await Restaurant.findOne({
            _id: req.body.restaurantId
        })


        let category = await Category.findOne({
            _id: req.body.categoryId
        });

        if (!category) {
            return res.status(400).json({
                type: "Not Found",
                msg: "This Category is not found"
            })
        }

        if (!restaurant) {
            return res.status(400).json({
                type: "Not Found",
                msg: "We were unable to find this restaurant."
            })
        }

        if (!restaurant.isVerified) {
            return res.status(400).json({
                type: "Not Verified",
                msg: "Please Verify your Email ."
            })
        }
        if (!restaurant.isActivated) {
            return res.status(400).json({
                type: "Not Activated",
                msg: "Your Account is yet to be avtivated"
            })
        }

        let addedProduct = await product.save();
        res.status(200).json({
            type: "Product Added",
            msg: "New Product Has Been Added",
            data: addedProduct
        })

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let data = await paginator.paginator(Product, page, 2, [{
            restaurantId: req.query.restaurantId
        }, ]);
        res.status(200).json({
            data
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Error",
            msg: "Something Went Wrong"
        })
    }
}

exports.editProductDetails = async (req, res) => {
    try {
        let productId = req.params.productId
        let productToBeEdited = await Product.findOneAndUpdate(productId, req.body, {
            new: true
        })
        res.status(200).json(productToBeEdited)

    } catch (err) {
        res.status(500).json({
            msg: "Something Went Wrong",
            error: err
        })
    }
}

exports.getProductDetails = async (req, res) => {
    try {
        let productId = req.params.productId
        let productDetails = await Product.findById(productId)
        res.status(200).json(productDetails)

    } catch (err) {
        res.status(500).json({
            msg: "Something Went Wrong",
            error: err
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId
        let productRemoved = await Product.findOneAndRemove(productId)
        res.status(200).json({
            type: "Removed",
            msg: "Product Removed"
        })

    } catch (err) {
        res.status(500).json({
            msg: "Something Went Wrong",
            error: err
        })
    }
}