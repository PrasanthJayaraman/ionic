var mongoose = require("mongoose");
var fs = require('fs');
var path = require("path");
var models_path =  path.join(__dirname, "/models");

var mongoURI = 'mongodb://heroku_q3gwtzxp:qku3e4j7id5m3gu6r0htkc3v3o@ds045031.mlab.com:45031/heroku_q3gwtzxp'


exports.connect = function (callback) {
    var db = mongoose.connect(mongoURI, { useMongoClient: true });
    var connection = mongoose.connection;
    connection.on('error', function (err) {
        console.log("MongoDB: Connection error.");
        callback(err);
    });

    connection.once('open', function () {
        console.log("MongoDB:Connected.", mongoURI);
        callback(null, connection)
    });
    return db;
};

exports.init = function (callback) {
    /** @TODO Automate DB clearing (optimist?) */

    console.log("Initializing database.");

    fs.readdirSync(models_path).forEach(function (file) {
        require(models_path + '/' + file);
    });
    callback(null);
};
