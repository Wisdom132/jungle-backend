const mongoose = require("mongoose");
const model = require("../app/account/User/model");
let paginator = async (collection, page) => {

    var perPage = 9
    var page = page || 1;
    var skipMath = (perPage * page) - perPage;

    let response = await collection.find().skip(skipMath).limit(perPage);
    let count = await model.count();
    return data = {
        data: response,
        current: page,
        perpage: perPage,
        pages: Math.ceil(count / perPage)
    }
}

module.exports = {
    paginator
};