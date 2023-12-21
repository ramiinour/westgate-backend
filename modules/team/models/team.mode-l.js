module.exports = (sequelize, DataTypes) => {

    class Team extends sequelize.Sequelize.Model {}
   
    Team.init({
        teamId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'teamId'
        },
        teamName: {
            type: DataTypes.STRING,
            field: 'teamName'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'email'
        },
        phoneNumber: {
            type: DataTypes.STRING,
            field: 'phoneNumber'
        },
        cellNumber: {
            type: DataTypes.STRING,
            field: 'cellNumber'
        },
    status: {
            type: DataTypes.INTEGER,
            field: 'status'
   },
    }, {
        indexes: [{
            fields: ['teamId']
        }],
        sequelize,
        modelName: 'Team'
    });

    return Team;
};