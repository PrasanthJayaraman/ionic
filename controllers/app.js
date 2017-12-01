var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');

exports.getPosts = function(req, res, next){
    var user = req.user;
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
    
    Post.getActivePosts(skip, limit, function (err, posts) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {            
            return res.status(200).send(posts);
        }
    });
}