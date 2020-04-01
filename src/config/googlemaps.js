const GoogleMapsAPI = require("googlemaps")
const config = require("./index");

let publicConfig = {
    key: config.mapkey,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true, // use https
    proxy: "" // optional, set a proxy for HTTP requests
};

let gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = {
    gmAPI
}