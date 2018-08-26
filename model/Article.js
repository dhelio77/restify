const mongoose = require('mongoose')
    ,mongooseApiQuery = require('mongoose-api-query')
    ,createdModified = require('mongoose-createdModified').createdModifiedPlugin
    ;
var Schema = mongoose.Schema;

// Article Model
var article = {
    title: String,
    slug: String,
    content: String,
    author: {
        name: String,
        ref: String
    }
};

// Article Schema
var ArticleSchema = new Schema(article, {minimize: false});
ArticleSchema.plugin(mongooseApiQuery);
ArticleSchema.plugin(createdModified, {index: true});

var Article = mongoose.model('Article', ArticleSchema);

// mongoose
module.exports = Article;