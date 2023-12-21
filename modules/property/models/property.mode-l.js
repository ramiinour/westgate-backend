module.exports = (sequelize, DataTypes) => {

    class Property extends sequelize.Sequelize.Model {}
    Property.init({
        propertyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'propertyId'
        },
        title: {
            type: DataTypes.STRING,
            field: 'title'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        },
        propertyRef: {
            type: DataTypes.STRING,
            field: 'propertyRef'
        },
        propertyPrice: {
            type: DataTypes.INTEGER,
            field: 'propertyPrice'
        },
        share: {
            type: DataTypes.INTEGER,
            field: 'share'
        },
        liked: {
            type: DataTypes.INTEGER,
            field: 'liked'
        },
        followed: {
            type: DataTypes.INTEGER,
            field: 'followed'
        },
        saved: {
            type: DataTypes.INTEGER,
            field: 'saved'
        },
        specsSize: {
            type: DataTypes.INTEGER,
            field: 'specsSize'
        },
        specsBeds: {
            type: DataTypes.STRING,
            field: 'specsBeds'
        },
        specsBaths: {
            type: DataTypes.INTEGER,
            field: 'specsBaths'
        },
        specsParking: {
            type: DataTypes.INTEGER,
            field: 'specsParking'
        },
        specsDevelopers: {
            type: DataTypes.STRING,
            field: 'specsDevelopers'
        },
        specsPropertyType: {
            type: DataTypes.STRING,
            field: 'specsPropertyType'
        },
        specsPropertyView: {
            type: DataTypes.STRING,
            field: 'specsPropertyView'
        },
        specsVacant: {
            type: DataTypes.BOOLEAN,
            field: 'specsVacant'
        },
        amenitiesBalcony: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesBalcony'
        },
        amenitiesCloseToMetro: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesCloseToMetro'
        },
        amenitiesHighFloor: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesHighFloor'
        },
        amenitiesFitted: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesFitted'
        },
        amenitiesInvestmentProperty: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesInvestmentProperty'
        },
        amenitiesLandmarkView: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesLandmarkView'
        },
        amenitiesKitchenAppliances: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesKitchenAppliances'
        },
        amenitiesGatedCommunity: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesGatedCommunity'
        },
        amenitiesOpenKitchen: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesOpenKitchen'
        },
        amenitiesVastuCompliant: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesVastuCompliant'
        },
        amenitiesBuiltWardrobes: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesBuiltWardrobes'
        },
        amenitiesAirConditioning: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesAirConditioning'
        },
        amenitiesGym: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesGym'
        },
        amenitiesLandmarkView: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesLandmarkView'
        },
        amenitiesCentralAC: {
            type: DataTypes.BOOLEAN,
            field: 'amenitiesCentralAC'
        },
        lat: {
            type: DataTypes.DECIMAL,
            field: 'lat'
        },
        lon: {
            type: DataTypes.DECIMAL,
            field: 'lon'
        },
         status: {
            type: DataTypes.INTEGER,
            field: 'status'
         },
    }, {
        indexes: [{
            fields: ['title']
        }],
        sequelize,
        modelName: 'Property'
    });

    return Property;
};