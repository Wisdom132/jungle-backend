const cloudinary = require("cloudinary");
const config = require('../config');

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

exports.uploads = file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(
            file,
            result => {
                resolve({
                    url: result.url,
                    id: result.public_id
                });
            }, {
                resource_type: "auto"
            }
        );
    });
};