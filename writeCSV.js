const fs = require('fs');

const dirPath = './data';
createDirectory(dirPath);
writeFile();

// Check for a folder called 'data'
// if the folder doesn't exist, create one
// else do nothing
function createDirectory(dirPath) {
    try {
        fs.mkdirSync(dirPath);
    }
    catch(error) {
        if(error.code !== 'EEXIST') {
            throw error;
        }
    }
}

function writeFile(products) {
    fs.writeFile('./data/output.json', JSON.stringify(products, null, 4), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}