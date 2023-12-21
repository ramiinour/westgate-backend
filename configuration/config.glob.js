const path = require('path'),
    environment = process.env.NODE_ENV || 'development',
    logger = require('./logger.winston'),
    _ = require('lodash'),
    fs = require('fs');

global.config = {};

const initialConfiguration = () => {
    try {
        global.config = require(path.join(__dirname, 'environments', `env.${environment}.json`));
        _.extend(config, JSON.parse(fs.readFileSync(path.join(__dirname, 'config.enums.json'), 'utf-8')));
        if (!config) {
            logger.info('error occurred while loading configurations');

        } else {
            logger.info(`configuration file ${environment}`);
        }

    } catch (err) {
        logger.error(`error occurred while loading initial configuration file ${err}`);
        throw {
            message: 'error occurred while loading configurations'
        }
    }
}

module.exports = { initialConfiguration };