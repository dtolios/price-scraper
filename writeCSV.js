/** @requires fs */
const fs = require('fs');

/** @requires csv */
const csv = require('csv');

/**
 * @funciton saveData
 * @param dirPath - the directory path you would like to create, and store your data in
 * @param data - a javascript array of data
 * Check for a folder called 'data', if the folder doesn't exist, create one, else do nothing
 */
function saveData(dirPath, data) {
    try {
        fs.mkdirSync(dirPath);
        makeCSV(data);
    }
    catch(error) {
        if(error.code !== 'EEXIST') {
            throw error;
        }
        makeCSV(data);
    }

}

/**
 * @function makeCSV
 * @param dirPath - the directory path to pass to writeFile
 * @param data - a javascript array of data
 * Creates a CSV based on the data array. Calls writeFile if data is stringified successfully
 */
function makeCSV(dirPath, data) {
    const options = {
        columns: {
            title: 'Title',
            price: 'Price',
            imgURL: 'ImageURL',
            url: 'URL',
            time: 'Time'
        },
        header: 4
    };
    csv.stringify(data, options, (error, output) => {
        if(error) throw error;
        writeFile(dirPath, output);
    })
}

/**
 * @function writeFile
 * @param dirPath - the directory path to save data file
 * @param data - a string of comma separated data
 * Takes in the directory path and the data string, and writes to a file named YYYY-MM-DD.csv
 */
function writeFile(dirPath, data) {
    const date = new Date();
    const fileName = `${dirPath}/${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}.csv`
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

module.exports.saveData = saveData;