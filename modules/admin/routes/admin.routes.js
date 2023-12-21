const getAdminController = require('../controllers/admin.controllers'),
{ authenticate } = require('../../../configuration/config.jwt');
// const userValidator = require('../validators/user.validators');
const passport = require("passport");

module.exports = (app, version) => {
    let moduleName = '/admin/jwt';
    app.post(
        version + moduleName + '/login',
        getAdminController.adminController
    );


    // profile with token
    app.get(
        version + moduleName + '/my-profile',
        authenticate,
        getAdminController.adminProfile
    );

    app.post(
        version + moduleName + '/sendsbscribeemail',
        getAdminController.sendSubscribeEmail
    );
    app.post(
        version + moduleName + '/sendcontactusemail',
        getAdminController.sendContactUsEmail
    );

}
