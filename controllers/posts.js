var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');

exports.showLogin = function(req, res, next){
    return res.render('login');
}

exports.login = function(req, res, next){
    var data = req.body;

    if(!data){
        return res.status(400).send({
            message: "Invalid Login credentials!"
        })
    }

    if(data.email != "jobswalaapp@gmail.com" && data.password != "welcome"){
        return res.status(400).send({
            message: "Wrong email address or password!"
        })
    }

    return res.status(200).send();
}

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
            return res.render('post', { data: { title: false }, categories: categories});
        } else {
            return res.render('post', { data: { title: false }, categories: {name : "NoCategories"} });
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
            post = post.toObject();
            Category.find({}, 'name', function (err, categories) {
                if (err) {
                    return res.status(500).send({
                        message: "Server is Busy, Please try again!"
                    });
                } else {     
                    console.log(post);
                    return res.render('post', {data: post, categories: categories });
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
    if(req.error){
        return res.status(400).send({
            message: "Invalid file format, upload only jpg or png"
        })
    }
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

exports.updatePost = function(req, res, next){
    var id = req.params.id;
    var updateData = req.body.post;

    if (!id) {
        return res.status(400).send({
            message: "Cannot edit the selected post"
        })
    }

    console.log(updateData);

    Post.findById({_id: id}, function(err, post){
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            post.update(updateData, function(err, updated){
                if (err) {
                    return res.status(500).send({
                        message: "Server is Busy, Please try again!"
                    });
                } else {
                    return res.status(200).send();
                }
            })
        }
    })
    
}