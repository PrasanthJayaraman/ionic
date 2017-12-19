var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');
var Ad = mongoose.model('Ad');

exports.getPosts = function(req, res, next){    
    var index = req.params.id;
    var limit, skip, numberOfPosts = 10;    
    if (!index) {
        index = 1;
    }
    limit = numberOfPosts;    
    if (index == 1) {
        skip = 0;
    } else {
        skip = (index - 1) * numberOfPosts;
    }
    
    Post.getActivePosts(skip, limit, function (err, posts) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if (posts && posts.length > 0) {           
            Ad.getActiveAds(function (err, ads) {
                if (err) {
                    return res.status(500).send({
                        message: "Server is Busy, Please try again!"
                    });
                } else {
                    return res.status(200).send({ post: posts, ad: ads});                            
                }
            });
        } else {
            return res.status(200).send({post: posts, ads: []});                    
        }
    });
}

exports.listCategory = function (req, res, next) {
    Category.find({active: true}, 'name', function (err, categories) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if (categories) {
            return res.status(200).send(categories);
        }        
    })
}

exports.getCategoryPost = function(req, res, next){
    var name = req.params.name;
    var index = req.params.id;
    var limit, skip, numberOfPosts = 10;
    if (!index) {
        index = 1;
    }
    limit = numberOfPosts;
    if (index == 1) {
        skip = 0;
    } else {
        skip = (index - 1) * numberOfPosts;
    }    

    if (!name) {
        name = "";
    }    

    
    console.log(name, index, limit, skip);
    Post.getPostByCategory(name, skip, limit, function(err, posts){    
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else if (posts && posts.length > 0) { 
            Ad.getActiveAds(function (err, ads) {
                if (err) {
                    return res.status(500).send({
                        message: "Server is Busy, Please try again!"
                    });
                } else {
                    return res.status(200).send({ post: posts, ad: ads });
                }
            });           
        } else {
            return res.status(200).send({ post: posts, ad: [] });
        }
    })

}

exports.redirectToShareLink = function(req, res, next){
    var platform = req.params.platform;
    var ios = "https://itunes.apple.com/in/app/youtube-watch-listen-stream/id544007664?mt=8";
    var android = "https://play.google.com/store/apps/details?id=com.google.android.youtube&hl=en";
    if(platform == 'ios'){
        res.status(200).send({link: ios});
    } else {
        res.status(200).send({ link: android});
    }
}