const userRoutes = require("./account/User/routes");
const restaurantRoutes = require("./api/restaurant/routes")
const categoryRoutes = require("./api/category/routes");
const productRoutes = require("./api/product/routes");
const cartRoutes = require("./api/cart/routes");


module.exports = app => {
    app.use("/user", userRoutes);
    app.use("/restaurant", restaurantRoutes);
    app.use("/category", categoryRoutes);
    app.use("/product", productRoutes);
    app.use("/cart", cartRoutes);
}