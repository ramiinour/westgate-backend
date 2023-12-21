// const passport = require('passport');
const getPropertyController = require('../controllers/property.controllers'),
    { authenticate } = require('../../../configuration/config.jwt'),
    upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.property);

module.exports = (app, version) => {
    let moduleName = '/listing';

    app.post(
        version + moduleName + '/property',
        authenticate,
        getPropertyController.createProperty
    );

    app.get(
        version + moduleName + '/addAmenitiesAndSpecifications',
        authenticate,
        getPropertyController.addAmenitiesAndSpecifications
    );

    //get: preloaded api for propertyies which will have propertyTypes

    app.get(
        version + moduleName + '/property/preload',
        // authenticate,
        getPropertyController.preload
    )

    app.get(
        version + moduleName + '/propertyOfDay',
        // authenticate,
        getPropertyController.propertyOfDay
    )

    app.get(
        version + moduleName + '/property/:name',
        // authenticate,
        getPropertyController.findOneProperty
    );

    app.get(
        version + moduleName + '/property/areaTitle/:areaName/:name',
        // authenticate,
        getPropertyController.findOnePropertyByNameAndArea
    );

    app.get(
        version + moduleName + '/property/area/:areaId',
        // authenticate,
        getPropertyController.getAllByArea
    );

    app.get(
        version + moduleName + '/property/id/:id',
        // authenticate,
        getPropertyController.findOnePropertyById
    );

    app.get(
        version + moduleName + '/property-draft/id/:id',
        // authenticate,
        getPropertyController.findOneDraftPropertyById
    );

    app.get(
        version + moduleName + '/property/searchByName/:name',
        // authenticate,
        getPropertyController.getAllByName
    );

    app.get(
        version + moduleName + '/property/:count/:page',
        // authenticate,
        getPropertyController.findAllProperty
    );

   

    app.get(
        version + moduleName + '/propertybyagent/:count/:page',
        // authenticate,
        getPropertyController.findAllPropertiesWithAgent
    );

    app.get(
        version + moduleName + '/propertybyagent-draft/:count/:page',
        // authenticate,
        getPropertyController.findAllDraftPropertiesWithAgent
    );

    app.put(
        version + moduleName + '/property/:id',
        authenticate,
        getPropertyController.updateProperty
    );

    app.put(
        version + moduleName + '/property-draft/:id',
        authenticate,
        getPropertyController.updatePropertyDraft
    );

    app.put(
        version + moduleName + '/property-draft-publish/:id',
        authenticate,
        getPropertyController.publishPropertyDraft
    );

    app.get(
        version + moduleName + '/getPropertyByFilters/search/:count/:page/:sort',
        // authenticate,
        getPropertyController.searchProperty
    )

    app.get(
        version + moduleName + "/getPropertyByAreaCityTitle",
        getPropertyController.getSearchResults
    )

    app.post(
        version + moduleName + '/sendpropertyemail/:id',
        // authenticate,
        getPropertyController.sendPropertyEmail
    )
   
   
    app.delete(
        version + moduleName + '/property/:id',
        authenticate,
        getPropertyController.deleteProperty
    );
    app.post(
        version + moduleName + '/property/image',
        authenticate,
        partnerImage.array('image', 10),
        upload.uploadImageResponse
        )

    app.post(
        version + moduleName + '/isPropertyOfDat/:id',
        authenticate,
        getPropertyController.setIsPropertyOfDayTrue
        )

    app.post(
        version + moduleName + '/isFeature/:id',
        authenticate,
        getPropertyController.isFeature
        )
        
    app.put(
        version + moduleName + '/property-image/:id',
        authenticate,
        getPropertyController.updatePropertyImage
    );
    
    app.delete(
        version + moduleName + '/property-image/:id',
        authenticate,
        getPropertyController.deletePropertyImage
    );

    app.delete(
        version + moduleName + '/property/nearby/:id',
        authenticate,
        getPropertyController.nearByDelete
    );

    app.put(
        version + moduleName + '/property/nearby/:id',
        authenticate,
        getPropertyController.nearByUpdate
    );

    app.put(
        version + moduleName + '/property/nearbymany/:id',
        authenticate,
        getPropertyController.nearByUpdateMany
    );

    app.get(
        version + moduleName + '/ameneties',
        // authenticate,
        getPropertyController.findAllAmenities
    );
    app.get(
        version + moduleName + '/specifications',
        // authenticate,
        getPropertyController.findAllSpecification
    );
    app.get(
        version + moduleName + '/propertiesbytypes',
        // authenticate,
        getPropertyController.getPropertiesByType
    );
    app.get(
        version + moduleName + '/propertiescountbycity',
        // authenticate,
        getPropertyController.getPropertiesCountByCity
    );
    app.get(
        version+moduleName+"/properties",
        getPropertyController.getAllPropertiesByIds
    )


};