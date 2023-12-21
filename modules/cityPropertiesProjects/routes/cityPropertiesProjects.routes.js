const passport = require('passport');
const { authenticate } = require('../../../configuration/config.jwt');
const cityPropertiesProjects = require('../controllers/cityPropertiesProjects.controller');

module.exports = (app, version) => {
    let moduleName = '/PropertiesProjectsInCity';
    console.log("Hello from PropertiesProjectsInCity routes");


    app.get(
        version + moduleName + '/count',
        // authenticate,
        cityPropertiesProjects.howManyPropertiesAndProjectsInCity
       

    );

};