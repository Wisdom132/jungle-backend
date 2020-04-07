const userRoutes = require("./account/User/routes");
const restaurantRoutes = require("./api/restaurant/routes")

module.exports = (app) => {
    app.use("/user", userRoutes);
    app.use("/restaurant", restaurantRoutes)
}