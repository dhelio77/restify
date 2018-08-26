const Account = require('../Rest/Account'),
    Article = require('../Rest/Article'),
    _ = require('lodash')
    ;

// home
server.get('/', Account.getHome);

// articles
server.post('/articles', Article.createArticle);

server.get('/articles', Article.getArticles);

server.get('/articles/:article_id', Article.getArticle);
server.put('/articles/:article_id', Article.updateArticle);
server.del('/articles/:article_id', Article.deleteArticle);