// const passport = require('passport');
const areaController = require('../controllers/area.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/area';

    app.get(
        version + moduleName + '/',
        // authenticate,
        areaController.getAll
    );

    app.get(
        version + moduleName + '/:count/:page/:sort',
        // authenticate,
        areaController.getAllCountPageSort
    );

    app.get(
        version + moduleName + '/id/:id',
        // authenticate,
        areaController.getOnById
    );
    
    app.get(
        version + moduleName + '/:name',
        // authenticate,
        areaController.getOne
    );

    app.get(
        version + moduleName + '/get/NamesAreas',
        // authenticate,
        areaController.getNamesAreas
    );

    app.get(
        version + moduleName + '/get/firstFiveAreas',
        // authenticate,
        areaController.firstFiveAreas
    );

    app.get(
        version + moduleName + "/get/popularAreas",
        areaController.getPopularAreas
    )

    app.post(
        version + moduleName + '/',
        authenticate,
        areaController.createArea
    );

    app.put(
        version + moduleName + '/:id',
        authenticate,
        areaController.updateArea
    );

    app.delete(
        version + moduleName + '/:id',
        authenticate,
        areaController.deleteArea
    );

    app.post(
        version + moduleName + '/uploadImage',
        authenticate,
        partnerImage.array('image', 10),
        upload.uploadImageResponse
    )
};