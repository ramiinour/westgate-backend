const GlobalLib = require('../../utils/global.utils'),
    Logger = require('../../../configuration/logger.winston'),
    { check, param } = require('express-validator');

let validateProperty = async (req, res, next) => {
    try {
    //   await check('language').notEmpty().withMessage(100).run(req);
    //check property model for validation
    await check('title').notEmpty().isString(50).withMessage(100).run(req);
    await check('description').notEmpty().isString(50).withMessage(100).run(req);
    await check('propertyRef').notEmpty().isString(50).withMessage(100).run(req);
    await check('propertyPrice').notEmpty().isInt().withMessage(100).run(req);
    await check('share').notEmpty().isInt().withMessage(100).run(req);
    await check('liked').notEmpty().isInt().withMessage(100).run(req);
    await check('followed').notEmpty().isInt().withMessage(100).run(req);
    await check('saved').notEmpty().isInt().withMessage(100).run(req);
    await check('specsSize').notEmpty().isInt().withMessage(100).run(req);
    await check('specsBeds').notEmpty().isString(50).withMessage(100).run(req);
    await check('specsBaths').notEmpty().isString(50).withMessage(100).run(req);
    await check('specsGarages').notEmpty().isString(50).withMessage(100).run(req);
    await check('specsVacant').notEmpty().isBoolean().withMessage(100).run(req);
    await check('specsParking').notEmpty().isString(50).withMessage(100).run(req);
    await check('specsDevelopers').notEmpty().isString(50).withMessage(100).run(req);
    await check('specsPropertyType').notEmpty().isString(50).withMessage(100).run(req);
    await check('amenitiesBalcony').notEmpty().isBoolean().withMessage(100).run(req);
    await check('amenitiesCloseToMetro').notEmpty().isBoolean().withMessage(100).run(req);
    await check('amenitiesHighFloor').notEmpty().isBoolean().withMessage(100).run(req);
    await check('amenitiesFitted').notEmpty().isBoolean().withMessage(100).run(req);
    await check('amenitiesInvestmentProperty').notEmpty().isBoolean().withMessage(100).run(req);
    await check('amenitiesLandmarkView').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesKitchenAppliances').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesGatedCommunity').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesOpenKitchen').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesVastuCompliant').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesBuiltWardrobes').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesAirConditioning').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesGym').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesLandmarkView').notEmpty.isBoolean.withMessage(100).run(req);
    await check('amenitiesCentralAC').notEmpty.isBoolean.withMessage(100).run(req);
    await check('lat').notEmpty.isInt.withMessage(100).run(req);
    await check('lon').notEmpty.isInt.withMessage(100).run(req);
    await check('status').notEmpty.isInt.withMessage(100).run(req);
    return GlobalLib.ValidateResponse('Property validation', req, res, next);
  } catch (err) {
        Logger.error(err);
        return next({ code: 1049 });
    }
};

module.exports = {
    validateProperty,
};
