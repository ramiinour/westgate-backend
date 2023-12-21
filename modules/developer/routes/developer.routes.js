// const passport = require('passport');
const developerController = require('../controllers/developer.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/developer';

    app.get(
        version + moduleName + '/:count/:page/:sort',
        // authenticate,
        developerController.getAll
    );

    app.get(
        version + moduleName + '/:name',
        // authenticate,
        developerController.getOne
    );

    app.get(
        version + moduleName + '/id/:id',
        // authenticate,
        developerController.getOneById
    );

    app.get(
        version + moduleName + '/get/NameIdDevelopers',
        // authenticate,
        developerController.getNameIdDevelopers
    );

    app.get(
        version + moduleName + '/get/firstFiveDevelopers',
        // authenticate,
        developerController.firstFiveDevelopers
    );

    app.post(
        version + moduleName + '/',
        authenticate,
        developerController.createDeveloper
    );

    app.put(
        version + moduleName + '/:id',
        authenticate,
        developerController.updateDeveloper
    );

    app.delete(
        version + moduleName + '/:id',
        authenticate,
        developerController.deleteDeveloper
    );

    app.post(
        version + moduleName + '/uploadImage',
        authenticate,
        partnerImage.array('image', 10),
        upload.uploadImageResponse
    )
};