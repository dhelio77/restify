'use strict'

const config = require('./lib/config'),
    restify = require('restify'),
    fs = require('fs'),
    winston = require('winston'),
    bunyanWinston = require('bunyan-winston-adapter'),
    mongoose = require('mongoose'),
    // swaggerJSDoc = require('swagger-jsdoc'),
    swaggerDoc = require('./lib/swagger-ui/swagger.json'),
    swaggerTools = require('swagger-tools');

/**
 * Logging
 */
global.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            timestamp: () => {
                return new Date().toString();
            },
            json: true
        })
    ]
});

/**
 * Initialise Server
 */
global.server = restify.createServer({
    name: config.name,
    version: config.version,
    log: bunyanWinston.createAdapter(log)
}).pre((req, res, next) => {
    req.log.info({ req: req }, 'REQUEST');
    next();
});

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {

    var options = {
        'swaggerUiDir': './lib/swagger-ui'
    };

    /**
     * Middleware
     */
    server
        .use(restify.CORS())
        .use(restify.fullResponse())
        .use(restify.jsonBodyParser({ mapParams: true }))
        .use(restify.acceptParser(server.acceptable))
        .use(restify.queryParser({ mapParams: true }));

    /**
     * Initialise swagger
     */
    server.get('/', (req, res) => {
        res.end("type /docs with all API docs");
    });

    let swaggerUi = middleware.swaggerUi(options);
    server.get('/docs/', swaggerUi);

    server.get(/\/js|css|lib|fonts|images\/?.*/, restify.serveStatic({
        directory: './lib/swagger-ui'
    }));

    server.get(/\/?.js/, restify.serveStatic({
        directory: './lib/swagger-ui'
    }));

    server.get(/\/?.json/, restify.serveStatic({
        directory: './lib/swagger-ui'
    }));

    /**
     * Error Handling
     */
    server.on('uncaughtException', (req, res, route, err) => {
        log.error(err.stack);
        // res.send(err);
    });

    /**
     * Lift Server, Connect to DB and Bind Routes
     */
    server.listen(config.port, () => {
        mongoose.connection.on('error', (err) => {
            log.error('<<< Mongoose default connection error: %s', err);
            process.exit(1);
        });

        mongoose.connection.on('open', (err) => {
            if (err) {
                log.error('<<< Mongoose default connection error: %s', err);
                process.exit(1);
            } else {
                log.info('%s v%s ready to accept connections on port %s in %s environment.',
                    server.name,
                    config.version,
                    config.port,
                    config.env);

                require('./routes');
            }
        });

        global.db = mongoose.connect(config.db.uri);
    });
});