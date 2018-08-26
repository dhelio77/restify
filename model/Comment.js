const mongoose = require('mongoose')
    ,mongooseApiQuery = require('mongoose-api-query')
    ,createdModified = require('mongoose-createdModified').createdModifiedPlugin
    ;
var Schema = mongoose.Schema;

// Comment Object
var comment = {
    text: String,
    article: {
        type: String,
        ref: 'Comment'
    },
    author: {
        type: String,
        ref: 'User'
    }
}

// Comment Schema
var CommentSchema = new Schema(comment, {minimize: false});
CommentSchema.plugin(mongooseApiQuery);
CommentSchema.plugin(createdModified, {index: true});

var Comment = mongoose.model('Comment', CommentSchema);

// mongoose
module.exports = Comment;