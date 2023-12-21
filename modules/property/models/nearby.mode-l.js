module.exports = (sequelize, DataTypes) => {

    class NearBy extends sequelize.Sequelize.Model {}
   
   NearBy.init({
        nearbyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'nearbyId'
        },
        schoolName: {
            type: DataTypes.STRING,
            field: 'schoolName'
        },
        curriculum: {
            type: DataTypes.STRING,
            field: 'specCurriculumsBeds'
        },
        ratings: {
            type: DataTypes.INTEGER,
            field: 'ratings'
        },
    }, {
        indexes: [{
            fields: ['nearbyId']
        }],
        sequelize,
        modelName: 'NearBy'
    });

    return NearBy;
};