const getTeamController = require('../controllers/team.controllers');
const { authenticate } = require('../../../configuration/config.jwt'),
upload = require('../../../configuration/config.multer'),
partnerImage = upload.upload(config.aws.s3.profile);


module.exports = (app, version) => {
    let moduleName = '/agency';
    let module = '/team';

    app.post(
        version + moduleName + '/team',
        authenticate,
        getTeamController.createTeam
    );

    app.post(
        version + moduleName + '/team/upload-image',
        partnerImage.array('image', 1),
        authenticate,
        upload.uploadImageResponse
    );

    app.get(
        version + module + '/auth',
        getTeamController.teamMemberWithToken
    );

    app.post(
        version + moduleName + '/login',
        getTeamController.loginController
    );

    
    app.get(
        version + moduleName + '/team/allNamesAndId',
        getTeamController.findAllNameAndId
    );
    // profile with token
    app.get(
        version + module + '/my-profile',
        authenticate,
        getTeamController.myProfile
    );

    app.get(
        version + moduleName + '/team/:id',
        getTeamController.findOneTeam
    );

    app.get(
        version + moduleName + '/fiveRadom',
        getTeamController.getFiveRandomAgents
    );
    app.get(
        version + moduleName + '/getNameId',
        getTeamController.getNameIdAgent
    );

    app.get(
        version + moduleName + '/team/:count/:page/:sort',
        getTeamController.findAllTeam
    );

    

    app.put(
        version + moduleName + '/team/:id',
        getTeamController.updateTeam
    );

    app.delete(
        version + moduleName + '/team/:id',
        getTeamController.deleteTeam
    );

};