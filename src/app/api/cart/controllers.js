const Cart = require("./model");

exports.addItemToCart = async (req, res) => {
    const {
        userId,
        productId
    } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    try {
        let cart = await Cart.findOne({
            userId: userId
        })

        if (!cart && quantity <= 0) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Invalid request"
            })
        }

        if (cart) {
            const indexFound = cart.items.findIndex(item => item.productId == productId); //check if index exists
            if (indexFound !== -1 && quantity <= 0) { //this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list
                cart.items.splice(indexFound, 1);
            } else if (indexFound !== -1) { //check if product exist,just add the previous quantity with the new quantity;
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
            } else if (quantity > 0) { // add new item to the cart
                cart.items.push({
                    productId: productId,
                    quantity: quantity
                })
            } else {
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

        } else { // if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created
            const cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }]
            }
            cart = new Cart(cartData);
            let data = await cart.save();
            res.json(data)

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