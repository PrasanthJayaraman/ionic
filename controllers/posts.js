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
    var index = req.params.index;
    var limit, skip;
    var numberOfPost = 20;
    if (!index){
        index = 1;
    }
    limit = numberOfPost;
    if(index == 1){
        skip = 0;
    } else {
        skip = (index - 1) * numberOfPost;
    }    
    Post.getPosts(skip, limit, function(err, posts){
        console.log("err", err);
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {                    
            //console.log(posts);
            return res.render('index', {posts: posts, clear: false});
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
            name: "https://jobswala.co/uploads/" + fileName
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

exports.searchPost = function(req, res, next){
    var data = req.body;

    console.log(data)

    if(Object.keys(data).length === 0){
        return res.status(400).send({
            message: "Invalid search request"
        })
    }    

    Post.find({ $text: { $search: data.search, $caseSensitive: false}}, function(err, posts){
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            //console.log(posts);
            return res.render('index', { posts: posts, clear: true });
        }
    })    
}