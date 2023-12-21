const apssport = require('passport');
const { authenticate } = require('../../../configuration/config.jwt');
const getContactController = require('../controllers/contact.controllers');
// const contactValidator = require('../validators/contact.validators');

module.exports = (app, version) => {
    let moduleName = '/contact';
console.log("Hello from contact routes");
 
    app.post(
        version + moduleName + '/createContactForProjects',
        getContactController.createContactForProjects
    );

    app.post(
        version + moduleName + '/createContactForProperties',
        getContactController.createContactForProperties
    );

    app.get(
        version + moduleName + '/contact/:id',
    //    contactValidator.validateContact,
       getContactController.findOneContact
    );

    app.get(
        version + moduleName + '/contact',
    //    contactValidator.validateContact,
       getContactController.findAllContact
    );

    app.put(
        version + moduleName + '/contact/:id',
    //    contactValidator.validateContact,
       getContactController.updateContact
    );

    app.delete(
        version + moduleName + '/contact/:id',
    //    contactValidator.validateContact,
       getContactController.deleteContact
    );

   
};