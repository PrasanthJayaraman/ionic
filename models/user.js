var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
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
    }
});

mongoose.model("User", userSchema);