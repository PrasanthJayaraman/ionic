var mongoose = require('mongoose');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var Notification = require('./notifications.js');
var async = require('async');
var _ = require('lodash');

exports.createPush = function(req, res, next){
    User.distinct('state', function(err, states){
        if(err){
            return res.status(500).send({
                message: "Server is busy, please try again!"
            })
        } else {            
            var temp = _.sortBy(states);
            temp.unshift('ALL');
            console.log(temp);
            res.render('push', { options: temp });
        }
    })
}


function collectAndPush(query, title, body){
    console.log(query);
    User.count(query, function (err, userCount) {
        if (err) {
            console.log(err);
        } else {
            var total = userCount;
            var limit = 100;
            var skip = 0;
            var iteration = Math.ceil(total / limit);
            console.log(total, limit, iteration);
            asyncLoop(iteration, function(loop){
                User.find(query, 'token', function(err, users){
                    if(err){ 
                        console.log(err);                       
                        loop.next();
                    } else {
                        var regTokens = [];
                        users.forEach(function(user){
                            regTokens.push(user.token);
                        });
                        console.log(regTokens);
                        Notification.send(regTokens, title, body);                        
                        loop.next();
                    }
                })
            }, function(){
                console.log("All push sent");
            });
        }
    })
}

exports.sendPush = function(req, res, next){
    var pushData = req.body.push;
    console.log(pushData);
    if (!pushData.type) {
        return res.status(400).send({
            message: "No push type to send"
        });
    }

    if (!pushData.body) {
        return res.status(400).send({
            message: "No body to send push"
        });
    }

    var query;
    if (pushData.type == "platform") {
        if (pushData.value == 'all') {
            query = { platform: { $ne: null } }
            collectAndPush(query, pushData.title, pushData.body);
        } else {
            query = { platform: pushData.value }
            collectAndPush(query);
        }
    } else if (pushData.type == "location") {
        if (pushData.value == 'ALL') {
            query = { state: { $ne: null } }
            collectAndPush(query, pushData.title, pushData.body);
        } else {
            query = { state: pushData.value }            
            collectAndPush(query);
        }        
    }

    res.send(200);
    
}

var optionsArray = ["ALL", "Tamil Nadu", "Karnataka"];


function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function () {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function () {
            return index - 1;
        },

        break: function () {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}