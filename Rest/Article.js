'use strict'
let Article = require('../model/Article');
const _ = require('lodash')
    , errors = require('restify-errors');

/**
 * Post or Create Article
 */
exports.createArticle = (req, res, next) => {
    log.info('<<< Article: ' + Article);
    log.info('<<< req.body: ' + req.body);
    log.info('<<< json.stringify: ' + JSON.stringify(req.body));

    let data = req.body || {};
    log.info('<<< data: ' + data);

    let articleModel = new Article(data);
    let save = articleModel.save();
    // assert.ok(promise instanceof require('mpromise'));
    save
        .then((article) => {
            log.info('<<< article saved with title: ' + article.title);
            res.send(201);
            next();
        })
        .catch((err) => {
            log.error('<<< error saving article: ' + err);
            return next(new errors.InternalError(err.message));
        });
};

// var articleModel = new Article(data);
//     articleModel.save((err) => {
//         if (err) {
//             log.error('<<< Error saving article: %s',err);
//             return next(new errors.InternalError(err.message));
//             next();
//         };
//         res.send(201);
//         next();
//     }); 

/**
 * List All Articles
 */
exports.getArticles = (req, res, next) => {
    Article.apiQuery(req.params, (err, data) => {
        if (err) {
            log.error(err);
            return next(new errors.InvalidContentError(err.errors.name.message));
        } else {
            log.info('<<< Extracted articles:\n' + data);
            res.send(data);
            next();
        }
    });
};

/**
 * Get specific article
 */
exports.getArticle = (req, res, next) => {
    Article.findOne({ _id: req.params.article_id }, (err, data) => {
        if (err) {
            log.error('<<< Error extracting %s', req.params.article_id);
            log.error('<<< Exception: ' + err);
            return next(new errors.InvalidContentError(err.errors.name.message));
        } else {
            log.info('<<< Extracted article:\n' + data);
            res.send(data);
            next();
        }
    });
};

/**
 * Update Article
 */
exports.updateArticle = (req, res, next) => {
    let data = req.body || {}

    if (!data._id) {
        _.extend(data, {
            _id: req.params.article_id
        });
        log.info('<<< extended data: ' + data);
    }

    Article.findOne({ _id: req.params.article_id }, function (err, doc) {
        if (err) {
            log.error('<<< Error looking for %s to update!', req.params.article_id);
            log.error('<<< Exception: ' + err);
            return next(new errors.InvalidContentError(err.errors.name.message));
        } else if (!doc) {
            return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
        }

        Article.update({ _id: data._id }, data, (err) => {
            if (err) {
                log.error('<<< Error updating %s', data._id);
                log.error('<<< Exception: ', err);
                return next(new errors.InvalidContentError(err.errors.name.message))
            }
            log.info('<<< Update successful for %s', data._id);
            res.send(200, data);
            next();
        })

    })
};

/**
 * Delete article
 */
exports.deleteArticle = (req, res, next) => {
    Article.remove({ _id: req.params.article_id }, (err) => {
        if (err) {
            log.error('<<< Error deleting %s', req.params.article_id);
            log.error('<<< Exception: ' + err);
            return next(new errors.InvalidContentError(err.errors.name.message));
        } else {
            log.info('<<< Deleted article:\n' + req.params.article_id);
            res.send(204);
            next();
        }
    });
};