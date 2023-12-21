const getLoginController = require('../controllers/login.controllers');
// const userValidator = require('../validators/user.validators');
const passport = require("passport");

module.exports = (app, version) => {
    let moduleName = '/auth/jwt';
    app.post(
        version + moduleName + '/login',
        getLoginController.loginController
    );

}
