/** @requires fs */
const fs = require('fs');

/** @requires winston */
const winston = require('winston');

/** configuration for winston's default logger. will log to specified file */
winston.configure({
    transports: [
        new (winston.transports.File)({
            name: 'error-file',
            filename: './logs/scraper-error.log',
            timestamp: true
        })
    ]
});

/**
 * @function logError
 * @param {object} error - the object/string to log
 * takes an error object or string as a parameter and passes it to winston.error for logging
 * tries to create logs directory if one does not exist.
 */
function logError(error) {
    try {
        fs.mkdirSync('./logs');
    }
    catch(err) {
        if(err.code !== 'EEXIST') {
            console.error('Cannot create logs directory.');
        }
    }
    winston.error(`${error}`);

}

module.exports.logError = logError;