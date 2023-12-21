'use strict';
const file = require('fs');
const glob = require('glob'),
    os = require('os'),
    path = require('path'),
    Logger = require('./logger.winston');

module.exports = (app) => {
    Logger.info('loading Routes');
    let routes = 'modules/**/*.routes.js',
        version = '/api',
        language = '/v1/:lang',
        baseUrl = `${version}${language}`;
    let newPath = path.join(__dirname, '../modules');
    newPath = newPath + "/**/*.routes.js";
    if (os.platform() === 'win32') { 
        glob.sync(routes).forEach((file) => {
            require(`../${file}`)(app, baseUrl);
            Logger.info(`${file} is loaded`);
        });
    } else {
        let syncedPath = glob.sync(newPath);
      syncedPath.forEach((file) => {
          require(`${file}`)(app, baseUrl);
          Logger.info(`${file} is loaded`);
      });
    }

};