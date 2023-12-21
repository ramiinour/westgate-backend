const GlobalLib = require('../../utils/global.utils'),
    Logger = require('../../../configuration/logger.winston'),
    { check, param } = require('express-validator');

let validateContact= async (req, res, next) => {
    try {
    //   await check('language').notEmpty().withMessage(100).run(req);
       await check('name').notEmpty().isString(10).withMessage(100).run(req);
       await check('email').notEmpty().isEmail().withMessage(100).run(req);
       await check('phone').notEmpty().isMobilePhone().withMessage(100).run(req);
       await check('message').notEmpty().isString(11).withMessage(100).run(req);
    return GlobalLib.ValidateResponse('Initial Contact Creation', req, res, next);
    } catch (err) {
        Logger.error(err);
        return next({ code: 1049 });
    }
};

module.exports = {
    validateContact,
};
