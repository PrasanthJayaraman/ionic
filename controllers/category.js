var mongoose = require('mongoose');
var Category = mongoose.model('Category');

exports.createCategory = function(req, res, next){
    var category = req.body.category;

    if(!category || !category.name || !category.active){
        return res.status(400).send({
            message: "Invalid Category data"
        })
    }

    var newObj = new Category({
        name : category.name,
        value: category.name.replace(/\s/g, '').toLowerCase(),
        created : new Date(),
        modified : new Date(),
        active: category.active
    });

    newObj.save(function(err){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            res.send(200);
        }
    })
}

exports.listCategory = function(req, res, next){
    Category.find({}, 'name, value', function (err, categories) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if (categories) {
            return res.render('category', { categories: categories });
        } else {
            return res.render('category', { categories: {}});
        }
    })
}