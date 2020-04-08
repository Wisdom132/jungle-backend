const Product = require("./model");
const Category = require("../category/model")
const Restaurant = require("../restaurant/model")
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

        let restaurant = await Restaurant.find({
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