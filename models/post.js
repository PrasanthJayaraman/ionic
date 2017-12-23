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
        type: [String],        
    },
    created: {
        type: Date
    },
    modified: {
        type: Date
    }
});

postSchema.index({ title: 'text' });

postSchema.statics.getAllPost = function(cb){
    this.find({}, null, {sort: {modified: -1}}, cb);
}

postSchema.statics.getPosts = function (skip, limit, cb) {
    this.find({}, null, { sort: { modified: -1 }, skip: skip, limit: limit }, cb);
}

postSchema.statics.getActivePosts = function (skip, limit, cb) {
    this.find({active: true}, null, { sort: { modified: -1 }, skip: skip, limit: limit }, cb);
}


postSchema.statics.create = function(obj, cb){
    new this(obj).save(cb);
}

postSchema.statics.getPostByCategory = function (name, skip, limit, cb) {    
    this.find({ categories: name, active: true }, null, { sort: { modified: -1 }, skip: skip, limit: limit }, cb);
}

postSchema.statics.findPostById = function (id, cb) {
    this.findOne({_id: id}, cb);
}

postSchema.methods.update = function (updates, options, cb) {
    var userToUpdate = this;
    if (typeof options !== 'object' && typeof options === 'function') {
        cb = options;
    }
    var editableFields = ['image', 'body', 'title', 'notifyUrl', 'applyUrl', 'active', 'categories'];
    editableFields.forEach(function (field) {
        if (updates[field] || updates[field] == false) {
            userToUpdate[field] = updates[field];
        }
    });    
    userToUpdate.save(cb);
};

mongoose.model('Post', postSchema);
