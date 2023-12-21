// const passport = require('passport');
const getSearchController = require('../controllers/search.controller'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.property);

module.exports = (app, version) => {
    let moduleName = '/search';

    app.get(
        version + moduleName + '/searchValues',
        getSearchController.searchValues
    );

};