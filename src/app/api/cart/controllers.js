const Cart = require("./model");
const Product = require("../product/model")

exports.addItemToCart = async (req, res) => {
    const {
        userId,
        productId
    } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    try {
        // -------Get users Cart ------
        let cart = await Cart.findOne({
            userId: userId
        })

        //-----Get Selected Product Details ----
        const productDetails = await Product.findById(productId);

        //-- Check if cart Exists and Check the quantity if items -------
        if (!cart && quantity <= 0) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Invalid request"
            })
        }

        //--If Cart Exists ----
        if (cart) {
            //---- check if index exists
            const indexFound = cart.items.findIndex(item => item.productId == productId);

            //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  --------
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }

            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }

            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----if quantity of price is 0 throw the error -------
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request"
                })
            }
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }
        //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity)
            }
            cart = new Cart(cartData);
            let data = await cart.save();
            res.json(data);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}
exports.subtractItem = async (req, res) => {
    const {
        userId,
        productId
    } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    try {
        // -------Get users Cart ------
        let cart = await Cart.findOne({
            userId: userId
        })
        //-----Get Selected Product Details ----
        const productDetails = await Product.findById(productId);
        //-- Check if cart Exists and Check the quantity if items -------
        if (!cart && quantity <= 0) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Invalid request"
            })
        }
        if (cart) {
            //---- check if index exists
            const indexFound = cart.items.findIndex(item => item.productId == productId);
            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            if (indexFound !== -1) {
                let updatedQuantity = cart.items[indexFound].quantity = cart.items[indexFound].quantity - quantity;
                //-----Check if the updated Quantity is less than or equal to 0,Then remove that item from the items array and then update the sumTotal value
                if (updatedQuantity <= 0) {
                    console.log("wevk")
                    cart.items.splice(indexFound, 1);
                    if (cart.items.length == 0) {
                        cart.subTotal = 0;

                    } else {
                        cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);

                    }
                } else {
                    cart.items[indexFound].quantity = updatedQuantity;
                    cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                    cart.items[indexFound].price = productDetails.price
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }

            }

            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}
exports.getUserCart = async (req, res) => {
    try {
        let user = req.query.user
        let cart = await Cart.findOne({
                userId: user
            })
            .populate({
                path: "items.productId",
                select: "name price total"
            });
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart Not Found",
            })
        }
        res.status(200).json(cart)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}

exports.emptyCart = async (req, res) => {
    try {
        const {
            userId
        } = req.body;
        let cart = await Cart.findOne({
            userId: userId
        })
        if (cart) {
            cart.items = [];
            cart.subTotal = 0
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Cart Has been emptied",
                data: data
            })

        } else {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart Not Found",
            })
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}