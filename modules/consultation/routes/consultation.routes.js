const client = require('../controllers/consultation.controller');

module.exports = (app, version) => {
    let moduleName = '/client';
    console.log("Hello from client");


    app.post(
        version + moduleName + '/consultation',
        // authenticate,
        client.sendListPropertyForm
       

    );

};