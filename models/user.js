var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String
    },
    key: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    coords: {
        type: [Number],
        index: '2dsphere'        
    },
    gender: {
        type: String
    },
    token: {
        type: String
    },
    age: {
        type: String
    },
    authKey: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    platform: {
        type: String
    }
});

mongoose.model("User", userSchema);