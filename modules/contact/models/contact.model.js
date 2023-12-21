module.exports = (sequelize, DataTypes) => {

    class Contact extends sequelize.Sequelize.Model {}
   Contact.init({
        contactId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'contactId'
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
       
        phone: {
            type: DataTypes.STRING,
            field: 'phone'
        },
        message: {
            type: DataTypes.STRING,
            field: 'message'
        },
  
    }, {
        indexes: [{
            fields: ['name']
        }],
        sequelize,
        modelName: 'Contact'
    });

    return Contact;
};