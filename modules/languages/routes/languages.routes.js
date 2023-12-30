// const passport = require('passport');
const LanguageController = require('../controllers/languages.controller'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.project);

module.exports = (app, version) => {
    let moduleName = '/languages';

    app.get(
        version + moduleName + '/',
        // authenticate,
        LanguageController.getAll
    );

};