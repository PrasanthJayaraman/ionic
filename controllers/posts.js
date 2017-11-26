var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');

exports.showPost = function(req, res, next){
    Post.getAllPost(function(err, posts){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {                    
            return res.render('index', {posts: posts});
        }
    });
}

exports.createPost = function(req, res, next){
    var data = req.body.post;
    console.log(data);
    if(!data){
        return res.status(400).send({
            message: "Invalid Post data"
        })
    }

    if(!data.title || !data.body || !data.categories){
        return res.status(400).send({
            message: "Some data is missing please fill all.."
        })
    }

    data.created = new Date();
    data.modified = new Date();

    Post.create(data, function(err, post){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            return res.send(200);
        }
    })    
}

exports.postForm = function(req, res, next){
    Category.find({}, 'name value', function(err, categories){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if(categories){
            console.log(categories);
            return res.render('post', { categories: categories});
        } else {
            return res.render('post', { categories: {name : "No Categories", value: ""} });
        }
    })
}

exports.editPost = function(req, res, next){
    var id = req.params.id;

    if(!id){
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }

    Post.findPostById(id, function(err, post){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            Category.find({}, function (err, categories) {
                if (err) {
                    return res.status(500).send({
                        message: "Server is Busy, Please try again!"
                    });
                } else {                                        
                    post.categories = categories;
                    console.log(post);
                    return res.render('post', {data: post});
                }
            })
        }
    })
}

exports.deletePost = function(req, res, next){
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }

    Post.remove({_id: id}, function(err){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            return res.redirect('/posts/1');            
        }
    })
}

exports.uploadImage = function(req, res, next){    
    var fileName = req.file.filename;
    if(fileName){
        var obj = {
            response: 200,
            name: "http://localhost:1234/uploads/"+fileName
        }
    } else {
        var obj = {
            response: 400,
            name: ""
        }
    }
    res.send(obj);
}


