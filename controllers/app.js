var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');
var Ad = mongoose.model('Ad');

exports.getPosts = function(req, res, next){    
    var index = req.params.index;
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
    console.log("asdsad");
    
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