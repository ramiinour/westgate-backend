const getLeadsController = require("../controllers/leads.index")
const { authenticate } = require('../../../configuration/config.jwt'),
upload = require('../../../configuration/config.multer'),
partnerImage = upload.upload(config.aws.s3.profile);


module.exports = (app, version) => {
    let moduleName = '/leads';
    
    // agent and admin
    app.get(
        version + moduleName + '/:count/:page/:sort',
        authenticate,
        getLeadsController.getAllLeads
    );

    app.get(
        version + moduleName + "/id/:id",
        authenticate,
        getLeadsController.getLeadByIdByAgent
    )

    // client
    app.post(
        version + moduleName + "/id/:id",
        getLeadsController.postLead
    )

    app.post(
        version + moduleName + "/:id/comment",
        authenticate,
        getLeadsController.addLeadCommentForAgent
    )

    app.delete(
        version + moduleName + "/:id/comments/:commentId",
        authenticate,
        getLeadsController.deleteCommentForAgent
    )

    app.put(
        version + moduleName + "/id/:id",
        authenticate,
        getLeadsController.updateLeadStatus
    )

    

};