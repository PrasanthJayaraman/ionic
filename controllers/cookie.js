var mongoose = require("mongoose");
var User = mongoose.model("User");

exports.authenticate = function(req, res, next){
    var authKey = req.headers.authorization;
    if(!authKey){
        return res.status(401).send({
            message: "Unauthorized access"
        });
    } else {
        User.findOne({authKey: authKey}, function(err, user){
            if(err){
                console.log(err);
                return res.status(401).send({
                    message: "Unauthorized User, Please login"
                });                
            } else if(user){
                req.user = user;
                next();
            } else {
                return res.status(401).send({
                    message: "Unauthorized User, Please login"
                });      
            }
        })
    }
}