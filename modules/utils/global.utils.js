const { validationResult } = require('express-validator'),
    Logger = require('../../configuration/logger.winston');
    // {errorResponse} = require('../../configuration/validation.express-validator');


const ValidateResponse = async (msg, req, res, next) => {
    // const response = await validationResult(req).formatWith(errorResponse);
    const response = validationResult(req).formatWith({ onlyFirstError: true });
    
    if (!response.isEmpty() && response.errors.length > 0) {
        let errorsArray = response.errors;
        Logger.error(`message: ${ msg }, error: ${errorsArray[0]}`);
        return next(errorsArray[0]);
    }
    return next();
};

module.exports = {
    ValidateResponse
}