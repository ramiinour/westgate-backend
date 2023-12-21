const GlobalLib = require('../../utils/global.utils'),
    Logger = require('../../../configuration/logger.winston'),
    { check, param } = require('express-validator');

let validateTeam = async (req, res, next) => {
    try {
    //   await check('language').notEmpty().withMessage(100).run(req);
    await check('teamName').notEmpty().isString(50).withMessage(100).run(req);
    await check('email').notEmpty().isEmail().withMessage(100).run(req);
    await check('phoneNumber').notEmpty().isMobilePhone().withMessage(100).run(req);
    await check('cellNumber').notEmpty().isMobilePhone().withMessage(100).run(req);
    return GlobalLib.ValidateResponse('Initial Team creation', req, res, next);
  } catch (err) {
        Logger.error(err);
        return next({ code: 1049 });
    }
};

module.exports = {
    validateTeam,
};
