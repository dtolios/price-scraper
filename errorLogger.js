/** @requires fs */
const fs = require('fs');

/** @requires winston */
const winston = require('winston');

winston.configure({
    transports: [
        new (winston.transports.File)({
            name: 'error-file',
            filename: './logs/scraper-error.log',
            timestamp: true
        })
    ]
});

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