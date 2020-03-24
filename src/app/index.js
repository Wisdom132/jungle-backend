const userRoutes = require("./account/User/routes");

module.exports = (app) => {
    app.use("/user",userRoutes)
}