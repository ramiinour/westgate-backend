const Logger = require('./logger.winston');

module.exports = (app) => {

    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
    });

    // Handling 500
    app.use((error, req, res, next) => {
        let errorMessage,
            langCode = (req.url).split('/')[3];
            langCode = global.config.languagesAllowed[langCode] || 'EN';

        if (error.msg && typeof error.msg === 'number') {
            error.code = error.msg;
        } else if (error.message && typeof error.message === 'number') {
             error.code = error.message;
        }

        errorMessage = error.msg ? 
        `${error.msg} ${global.errors[error.msg].msg[langCode]}` : 
        error.code ? 
        `${error.code} ${global.errors[error.code].msg[[langCode]]}` : 
        error;

        Logger.error(` inside error handler: ${errorMessage}`);

        let response = 400;
        if (error.status === 404) {
            response = 404;
            error.code = 6;
        }

        if (!error.code || !error.msg) {
            res.status(500);
            response = 500;
            error.code = 7;
        } else if (error.code === 3 || error.code === 90 || error.code === 91 || error.code === 92) {
            res.status(401);
            response = 401;
        } else if (error.code === 4 || error.code === 110) {
            res.status(403);
            response = 403;
        }

        return res.json({
            success: 0,
            message: error.code && global.errors[error.code] ? 
            global.errors[error.code].msg[langCode] : 
            error.msg && global.errors[error.msg] ? 
            global.errors[error.msg].msg[langCode] : 
            error.message,
            response: response,
            data: {},
        });
    });
};
