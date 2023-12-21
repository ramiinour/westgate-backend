module.exports = (sequelize, DataTypes) => {

    class Specification extends sequelize.Sequelize.Model {}
   // const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/ ;
    Specification.init({
        specificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'specificationId'
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
            type: DataTypes.STRING,
            field: 'specsVacant'
        },
       
    }, {
        indexes: [{
            fields: ['specificationId']
        }],
        sequelize,
        modelName: 'Specification'
    });

    return Specification;
};