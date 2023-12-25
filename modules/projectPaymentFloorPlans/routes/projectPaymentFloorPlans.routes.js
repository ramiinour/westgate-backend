const passport = require('passport');
const { authenticate } = require('../../../configuration/config.jwt');
const projectPaymentFloorPlan = require('../controllers/projectPaymentFloorPlans.controller');
// const articleController = require('./../controllers/article.controller')

upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.article);

module.exports = (app, version) => {
    let moduleName = '/projectPaymentFloorPlan';
    console.log("Hello from ProjectPaymentFloorPlan routes");


    app.get(
        version + moduleName + '/getAll/:count/:page/:sort',
        // authenticate,
        projectPaymentFloorPlan.getAllProjectPaymentFloorPlan
    );

    app.get(
        version + moduleName + '/getOne/:name',
        // authenticate,
        projectPaymentFloorPlan.getOneProjectPaymentFloorPlan
    );

    app.get(
        version + moduleName + '/getOne/id/:id',
        // authenticate,
        projectPaymentFloorPlan.getOneProjectPaymentFloorPlanById
    );

    app.get(
        version + moduleName + '/getOneDraft/id/:id',
        // authenticate,
        projectPaymentFloorPlan.getOneProjectPaymentFloorPlanByIdDraft
    );

    app.get(
        version + moduleName + '/getOneByAgentId/:count/:page/:sort',
        // authenticate,
        projectPaymentFloorPlan.getAllProjectPaymentFloorPlanByAgent
    );

    app.get(
        version + moduleName + '/getOneByAreaId/:count/:page/:sort',
        // authenticate,
        projectPaymentFloorPlan.getAllProjectPaymentFloorPlanByArea
    );

    app.get(
        version + moduleName + '/getOneByAgentIdDraft/:count/:page/:sort',
        // authenticate,
        projectPaymentFloorPlan.getAllProjectPaymentFloorPlanByAgentDraft
    );

    

    app.get(
        version + moduleName + '/allFloorPlan',
        // authenticate,
        projectPaymentFloorPlan.getAllFloorPlans
    );
    app.get(
        version + moduleName + '/search/:count/:page/:sort',
        // authenticate,
        projectPaymentFloorPlan.searchProject
    )

    app.get(
        version + moduleName + '/header',
        // authenticate,
        projectPaymentFloorPlan.searchProjectHeader
    )

    app.get(
        version + moduleName + "/projects",
        projectPaymentFloorPlan.getAllProjectsByIds
    )
    app.post(
        version + moduleName + '/create',
        authenticate,
        projectPaymentFloorPlan.createProjectPaymentFloorPlan
    )

    app.put(
        version + moduleName + '/update/:id',
        authenticate,
        projectPaymentFloorPlan.updateProjectPaymentFloorPlan
    )

    app.put(
        version + moduleName + '/update-draft/:id',
        authenticate,
        projectPaymentFloorPlan.updateProjectPaymentFloorPlanDraft
    )

    app.put(
        version + moduleName + '/publish-draft/:id',
        authenticate,
        projectPaymentFloorPlan.publishProjectPaymentFloorPlanDraft
    )

    app.delete(
        version + moduleName + '/delete/:id',
        authenticate,
        projectPaymentFloorPlan.deleteProjectPaymentFloorPlan
    )

    app.post(
        version + moduleName + '/reactiveProject/:id',
        authenticate,
        projectPaymentFloorPlan.reactiveProjectPaymentFloorPlan
    )

    app.post(
        version + moduleName + '/isFeature/:id',
        authenticate,
        projectPaymentFloorPlan.isFeature
    )
    app.post(
        version + moduleName + '/sendprojectemail/:id',
        authenticate,
        projectPaymentFloorPlan.sendProjectEmail
    )

   
};

