// const passport = require('passport');
const cityController = require('../controllers/city.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/city';

    app.get(
        version + moduleName + '/',
        // authenticate,
        cityController.getAll
    );

    app.get(
        version + moduleName + '/:id',
        // authenticate,
        cityController.getOne
    );

    app.post(
        version + moduleName + '/',
        // authenticate,
        cityController.createCity
    );

    // app.put(
    //     version + moduleName + '/:id',
    //     authenticate,
    //     cityController.updateCountry
    // );

    app.delete(
        version + moduleName + '/:id',
        // authenticate,
        cityController.deleteCity
    );

};