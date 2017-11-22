var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    active : {
        type : Boolean
    },
    title : {
        type: String
    },
    body : {
        type: String
    },
    image : {
        type: String
    },
    notifyUrl : {
        type: String
    },
    applyUrl : {
        type: String
    },
    categories : {
        type: String,        
    },
    created: {
        type: Date
    },
    modified: {
        type: Date
    }
});

postSchema.statics.getAllPost = function(cb){
    this.find({}, null, {sort: {modified: -1}}, cb);
}

postSchema.statics.create = function(obj, cb){
    new this(obj).save(cb);
}

postSchema.statics.findPostById = function (id, cb) {
    this.findOne({_id: id}, cb);
}

mongoose.model('Post', postSchema);
