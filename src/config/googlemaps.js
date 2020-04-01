const GoogleMapsAPI = require("googlemaps")

let publicConfig = {
    key: 'AIzaSyDMKSUYaVP2C1pwlklUllVmo8nOoC9zMuU',
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true, // use https
    proxy: "" // optional, set a proxy for HTTP requests
};

let gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = {
    gmAPI
}