var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var User = mongoose.model("User");
var common = require("../common");
var request = require('request');

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

exports.socialLogin = function(req, res, next){
    var data = req.body.user;

    if (!data || Object.keys(data).length == 0) {
        return res.status(400).send({
            message: "Invalid credentials entered"
        });
    } else {
        if (!data.email) {
            return res.status(400).send({
                message: "Invalid Email Address"
            });

        } else if (!data.name) {
            return res.status(400).send({
                message: "Invalid Name"
            });
        }

        data.authKey = common.rand();

        User.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true }, function (err, user) {
            if (err) {
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

exports.updateUser = function(req, res, next){
    var user = req.user;
    var data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({
            message: "No user data to update"
        });
    } else {
        User.findByIdAndUpdate({_id: user._id}, {$set: data}, {new: true}, function(err, updatedUser){        
            console.log(err);
            if (err) {
                return res.status(500).send({
                    message: "Server is busy, please try again!"
                })
            } else {
                return res.status(200).send(updatedUser);
            }
        })
    }
}

exports.updateDeviceInfo = function(req, res, next){
    var user = req.user;
    var data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({
            message: "No user data to update"
        });
    } else {
        if(data.location){
            var loc = data.location;
            if (Array.isArray(loc) && loc.length == 2){
                var coords = loc.toString();
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+coords+"&key=AIzaSyAvfWo1YSG1i_ViD04c6WiOXg8TnJpuUXk"                
                request(url, function (error, response, body) { 
                    var temp;
                    try {
                        temp = JSON.parse(body);
                    } catch(e){
                        temp = body;
                    }
                    if (temp.status == "OK") {
                        var full = temp.results[2].formatted_address;
                        var splitted = full.split(",");
                        var length = splitted.length;
                        var obj = {
                            coords: data.location,
                            country: splitted[length - 1].trim(),
                            state: splitted[length - 2].trim(),
                            city: splitted[length - 3].trim()
                        }                        
                        User.findByIdAndUpdate({ _id: user._id }, { $set: obj }, function (err, updatedUser) {                                                        
                            debugger;
                            if (err) {
                                return res.status(500).send({
                                    message: "Server is busy, please try again!"
                                })
                            } else {
                                return res.status(200).send();
                            }
                        })
                    } else {
                        return res.status(400).send({
                            message: "Cannot rever geo the location"                            
                        });
                    }    
                });                
            } else {
                return res.status(400).send({
                    message: "Invalid Location"
                })
            }
        } else {
            User.findByIdAndUpdate({ _id: user._id }, { $set: data }, function (err, updatedUser) {
                if (err) {
                    return res.status(500).send({
                        message: "Server is busy, please try again!"
                    })
                } else {
                    return res.status(200).send();
                }
            })
        }       
    }
}

