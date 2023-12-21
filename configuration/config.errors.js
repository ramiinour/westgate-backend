const glob = require('glob'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    os = require('os'),
    Logger = require('./logger.winston');

Logger.info('Loading Errors....!!!!');
let route = 'modules/**/*.errors.json';
let newPath = path.join(__dirname, '../modules');
newPath = newPath + "/**/*.errors.json";
let errorInitialized = {
    '1': {
        'msg': {
            'EN': '',
            'AR': ''
        }
    },
};
if (os.platform() === 'win32') { 
    glob.sync(route).forEach(function(file) {
        _.extend(errorInitialized, JSON.parse(fs.readFileSync(file, 'utf-8')));
        Logger.info(`error file: ${file} is loaded`);
    });

} else {
    let syncedPath = glob.sync(newPath);
        syncedPath.forEach(function(file) {
            _.extend(errorInitialized, JSON.parse(fs.readFileSync(file, 'utf-8')));
            Logger.info(`error file: ${file} is loaded`);
        }
    );
}

module.exports = errorInitialized;