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

exports.categoryForm = function(req, res, next){
    return res.render('category', {data: {}});
}

exports.listCategory = function(req, res, next){
    Category.find({}, 'name modified active', { sort: { active: -1}},  function (err, categories) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if (categories) {            
            return res.render('list', { categories: categories });
        } else {
            return res.render('list', { categories: []});
        }
    })
}

exports.editCategory = function(req, res, next){
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }

    Category.findOne({_id: id}, function(err, category){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            res.render('category', {data: category})
        }
    })
}

exports.updateCategory = function(req, res, next){
    var id = req.params.id;
    var data = req.body.category;

    if (!data.name || !data.active) {
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }


    Category.findByIdAndUpdate({_id: id}, {$set: {name: data.name, active: data.active, modified: new Date()}}, function(err, category){
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            res.send(200);
        }
    });
}

exports.deleteCategory = function(req, res, next){
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }

    Category.remove({ _id: id }, function (err) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            return res.redirect('/category/show');
        }
    })
}