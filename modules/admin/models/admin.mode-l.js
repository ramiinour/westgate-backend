module.exports = (sequelize, DataTypes) => {

    class Admin extends sequelize.Sequelize.Model {}
   // const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/ ;
    Admin.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        role: {
            type: DataTypes.INTEGER,
            field: 'role'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'email'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password'
        },
        phone: {
            type: DataTypes.STRING,
            field: 'phone'
        },
    status: {
            type: DataTypes.INTEGER,
            field: 'status'
   },
    }, {
        indexes: [{
            fields: ['name']
        }],
        sequelize,
        modelName: 'User'
    });

    return User;
};