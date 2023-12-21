// const passport = require('passport');
const getProjectController = require('../controllers/project.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/listing';

    app.post(
        version + moduleName + '/project',
        authenticate,
        getProjectController.createProject
    );

    app.get(
        version + moduleName + '/project/:id',
        // authenticate,
        getProjectController.findOneProject
    );

    app.delete(
        version + moduleName + '/project/:id',
        authenticate,
        getProjectController.deleteProject
    );

    app.get(
        version + moduleName + '/project/views/:id',
        authenticate,
        getProjectController.getViews
    );

    app.get(
        version + moduleName + '/project/buildings/:id',
        authenticate,
        getProjectController.getBuildings
    )

    app.get(
        version + moduleName + '/project/payment/paymentType',
        // authenticate,
        getProjectController.getPaymentTypes
    )

    app.get(
        version + moduleName + '/project',
        // authenticate,
        getProjectController.findAllProject
    );


    app.put(
        version + moduleName + '/project/:id',
        authenticate,
        getProjectController.updateProject
    )

    app.post(
        version + moduleName + '/project/image',
        authenticate,
        partnerImage.array('image', 10),
        upload.uploadImageResponse
    )

    app.get(
        version + moduleName + '/projects/preload',
        // authenticate,
        getProjectController.preload
    )

};