var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String
    },
    value: {
        type: String
    },
    created :{
        type: Date
    },
    modified: {
        type: Date
    },
    active : {
        type: Boolean
    }
});

mongoose.model('Category', categorySchema);