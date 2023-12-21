// const passport = require('passport');
const countyController = require('../controllers/country.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/country';

    app.get(
        version + moduleName + '/',
        // authenticate,
        countyController.getAll
    );

    app.get(
        version + moduleName + '/:id',
        // authenticate,
        countyController.getOne
    );

    app.post(
        version + moduleName + '/',
        authenticate,
        countyController.createCountry
    );

    // app.put(
    //     version + moduleName + '/:id',
    //     authenticate,
    //     countyController.updateCountry
    // );

    app.delete(
        version + moduleName + '/:id',
        authenticate,
        countyController.deleteCountry
    );

};