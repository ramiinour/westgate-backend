const glob = require('glob'),
    Sequelize = require('sequelize'),
    path = require('path'),
    Logger = require("./logger.winston"),
    root = path.normalize(__dirname + '/../');
let database = {};

let sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        },
        timestamps: true,
        freezeTableName: true,
        underscored: false
    },
    logging: (config.db.enableSequelizeLog) ? message => Logger.info(message) : false,
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 40000
    }
})

glob('modules/**/*.model.js', (err, files) => {

    if (err) {
        Logger.error(err);
        return;
    }

    Logger.info('models are loading ...');
    let model;
    files.forEach(file => {
       Logger.info(`Loading model ${file}`);
       model = require(path.join(root, file))(sequelize, Sequelize.DataTypes);
       database[model.name] = model; 
    });

    sequelize
    .sync({ force: config.db.forceSync })
    .then(() => {
        sequelize
        .authenticate()
        .then(() => {

            // let dbSeeding = require('./dbSeed');
            // dbSeeding(db, sequelize);

            Logger.info(
                `DataBase Connection established successfully: Host ${config.db.host} database ${config.db.name}`
            );

        }).catch((err) => {
            Logger.error(`Unable to connect to the DB: ${err}`);
        });

    }).catch(err => {
        // console.log(err);
        Logger.error(`Unable to connect to the database: ${err}`);
    });
      Object.keys(database).forEach(model => {
        if (database[model].options.hasOwnProperty('associate')) {
            database[model].options.associate(database);
        }
        if ('associate' in database[model]) {
            database[model].associate(database);
        }
    });
});

module.exports = {
    sequelize,
    Sequelize,
    database
};