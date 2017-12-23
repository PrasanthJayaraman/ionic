var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var User = mongoose.model("User");
var common = require("../common");
var request = require('request');

exports.getStarted = function(req, res, next){
    var data = req.body.user;
    console.log(req.body);

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

        if(data.key){            
            User.findOneAndUpdate({
                key: data.key
            }, data, {
                upsert: true,
                new: true
            }, function (err, user) {
                console.error(err);
                if (err) {
                    return res.status(400).send({
                        message: "Server is busy, Please try again!"
                    });
                } else {
                    return res.status(200).send(user);
                }
            });
        } else if(data.email) {
            User.findOneAndUpdate({
                email: data.email
            }, data, {
                upsert: true,
                new: true
            }, function (err, user) {
                console.error(err);
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

       if(data.key){
           User.findOneAndUpdate({ key: data.key }, data, { upsert: true, new: true }, function (err, user) {
               console.error(err);
               if (err) {
                   return res.status(400).send({
                       message: "Server is busy, Please try again!"
                   });
               } else {
                   return res.status(200).send(user);
               }
           });
       } else if(data.email) {
           User.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true }, function (err, user) {
               console.error(err);
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
        User.findOneAndUpdate({_id: user._id}, {$set: data}, {new: true}, function(err, updatedUser){        
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
    var data = req.body;
    console.log(req.body);
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({
            message: "No user data to update"
        });
    } 
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
                        key: data.key,
                        coords: data.location,
                        country: splitted[length - 1].trim(),
                        state: splitted[length - 2].trim().replace(/[0-9]/g, "").replace(/ /g, ''),
                        city: splitted[length - 3].trim()
                    }                        
                    console.log("save data", data.key, JSON.stringify(obj));
                    User.findOneAndUpdate({ key: data.key }, { $set: obj }, {
                        upsert: true                        
                    }, function (err, updatedUser) {  
                        console.error(err);                                                                              
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
        console.log("save data 1", data.key, JSON.stringify(data));
        User.findOneAndUpdate({ key: data.key }, { $set: data }, {
            upsert: true
        }, function (err, updatedUser) {
            console.error(err);
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

