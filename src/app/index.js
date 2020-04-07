const userRoutes = require("./account/User/routes");
const resturantRoutes = require("./api/resturant/routes")

module.exports = (app) => {
    app.use("/user", userRoutes);
    app.use("/resturant", resturantRoutes)
}