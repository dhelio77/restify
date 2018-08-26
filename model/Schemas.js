const mongoose = require('mongoose')
    ,mongooseApiQuery = require('mongoose-api-query')
    ,createdModified = require('mongoose-createdModified').createdModifiedPlugin
    ;
const Schema = mongoose.Schema;

// Article Object
var article = {
    title: String,
    slug: String,
    content: String,
    author: {
        type: String,
        ref: 'User'
    }
};

// Comment Object
var comment = {
    text: String,
    article: {
        type: String,
        ref: 'Article'
    },
    author: {
        type: String,
        ref: 'User'
    }
}

// Article Schema
var ArticleSchema = new Schema(article);
ArticleSchema
    .plugin(mongooseApiQuery)
    .plugin(createdModified, {index: true});

// Comment Schema
var CommentSchema = new Schema(comment);
CommentSchema
    .plugin(mongooseApiQuery)
    .plugin(createdModified, {index: true});

// mongoose
exports.schemas = {
    "article": mongoose.model('Article', ArticleSchema),
    "comment": mongoose.model('Comment', CommentSchema)
}
