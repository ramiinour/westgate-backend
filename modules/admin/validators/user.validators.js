const GlobalLib = require('../../utils/global.utils'),
    Logger = require('../../../configuration/logger.winston'),
    { check, param } = require('express-validator');

let validateUser = async (req, res, next) => {
    try {
//       await check('language').notEmpty().withMessage(100).run(req);
       await check('name').notEmpty().isString(50).withMessage(100).run(req);
       await param('email').notEmpty().isEmail().withMessage(100).run(req);
       await param('password').notEmpty().isStrongPassword().withMessage(100).run(req);
       await param('phone').notEmpty().isMobilePhone().withMessage(100).run(req);
       await param('role').notEmpty().isString(11).withMessage(100).run(req);
       return GlobalLib.ValidateResponse('Initial Registration', req, res, next);
    } catch (err) {
        Logger.error(err);
        return next({ code: 1049 });
    }
};

module.exports = {
    validateUser,
};
