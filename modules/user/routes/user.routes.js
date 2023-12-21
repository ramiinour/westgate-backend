const passport = require('passport');
const getUserController = require('../controllers/user.controllers');
// const userValidator = require('../validators/user.validators');

module.exports = (app, version) => {
    let moduleName = '/register';
 
    app.post(
        version + moduleName + '/user',
        getUserController.createUserController
    );

    app.get(
        version + moduleName + '/user',
    //    userValidator.validateUser,
        getUserController.findUserWithToken
    );

    
    app.get(
        version + moduleName + '/user/:id',
    //    userValidator.validateUser,
        getUserController.findOneUserController
    );

    app.get(
        version + moduleName + '/user',
    //    userValidator.validateUser,
        getUserController.findAllUserController
    );

    app.put(
        version + moduleName + '/user/:id',
    //    userValidator.validateUser,
        getUserController.updateUserController
    );

    app.delete(
        version + moduleName + '/user/:id',
    //    userValidator.validateUser,
        getUserController.deleteUserController
    );

    app.post(
    version + moduleName + '/login', 
    passport.authenticate('local', 
    { failureRedirect: version + moduleName + '/user'}), 
    async (req, res) => {
        resizeBy.send("login");
    }
    );
};