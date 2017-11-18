var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var User = mongoose.model("User");
var common = require("../common");

exports.getStarted = function(req, res, next){
    var data = req.body.user;

    if(!data || Object.keys(data).length == 0){
        return res.status(400).send({
            message: "Invalid credentials entered"
        });
    } else {
        if(!data.phone){
            return res.status(400).send({
                message: "Invalid Phone Number"
            });
        } else if(!data.email)        {
            return res.status(400).send({
                message: "Invalid Email Address"
            });
            
        } else if(!data.name){
            return res.status(400).send({
                message: "Invalid Name"
            });
        }

        data.authKey = common.rand();

        User.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true }, function(err, user){
        if(err){
            return res.status(400).send({
                message: "Server is busy, Please try again!"
            });
        } else {
            return res.status(200).send(user);
        }
    });        

    }
}

exports.getUser = function(req, res, next){
    var user = req.user;
    return res.status(200).send(user);
}