const fs = require('fs');

const csv = require('csv');

// Check for a folder called 'data'
// if the folder doesn't exist, create one
// else do nothing
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

function makeCSV(data) {
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
        writeFile(output);
    })
}

function writeFile(data) {
    const date = new Date();
    const fileName = `./data/${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}.csv`
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

module.exports.saveData = saveData;