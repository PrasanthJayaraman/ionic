var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adSchema = new Schema({
    active: {
        type: Boolean
    },
    name: {
        type: String
    },
    script: {
        type: String
    },
    created: {
        type: Date
    },
    modified: {
        type: Date
    }
});

adSchema.statics.getAllAd = function (cb) {
    this.find({}, null, { sort: { modified: -1 } }, cb);
}

adSchema.statics.getActiveAds = function (cb) {
    this.find({ active: true }, null, { sort: { modified: -1 } }, cb);
}

mongoose.model('Ad', adSchema);
