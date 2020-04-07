const Category = require("./model");

exports.getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            data: categories
        })
    } catch (err) {

    }
}

exports.createCategory = async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name
        })
        await category.save();
        res.status(200).json({
            msg: "Category Created"
        })
    } catch (err) {

    }
}

exports.removeCategory = async (req, res) => {
    try {
        let removeAction = await Category.remove({
            _id: req.params.id
        });
        res.status(200).json({
            msg: "Category Deleted"
        })
    } catch (err) {
        console.log(err)
    }
}

exports.editCategory = async (req, res) => {
    try {
        let updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            },

        }, {
            new: true
        })
        res.status(200).json({
            msg: "Category Updated",
            data: updatedCategory
        })
    } catch (err) {

    }
}