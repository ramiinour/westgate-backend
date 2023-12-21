module.exports = (sequelize, DataTypes) => {

    class Amenities extends sequelize.Sequelize.Model {}
    Amenities.init({
        amenitiesId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'amenitiesId'
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
  
    }, {
        indexes: [{
            fields: ['amenitiesId']
        }],
        sequelize,
        modelName: 'Amenities'
    });

    return Amenities;
};