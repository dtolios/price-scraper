
// Require the desired libraries
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');

const options = {
    hostname: 'www.shirts4mike.com',
    port: 80,
    path: '/shirts.php',
    method: 'GET',
    headers: {
        'Content-Type': 'text/html'
    }
};

const products = [];

function Product(title, price, url, imgURL) {
    this.title = title;
    this.price = price;
    this.url = url;
    this.imgURL = imgURL;
}

function getProducts() {
    try {
        const request = http.request(options, (response) => {
            if (response.statusCode === 200) {
                let html = '';

                response.on('data', (chunk) => {
                    html += chunk;
                });

                response.on('end', () => {
                    const $ = cheerio.load(html);

                    $('.products li').each((i, elem) => {
                        const productPath = $(elem).children('a').attr('href');
                        getProduct(productPath);
                    });
                    const dirPath = './data';
                    createDirectory(dirPath);
                    writeFile();
                });
            }
            else {
                // Status code error
            }
        });
        request.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        request.end();
    }
    catch(error) {
        // Malformed URL Error
        console.error("there was a URL error");
    }
}

function getProduct(productPath) {
    try {
        options.path = `/${productPath}`;

        const request = http.request(options, (response) => {
            if (response.statusCode === 200) {
                let html = '';

                response.on('data', (chunk) => {
                    html += chunk;
                });

                response.on('end', () => {
                    const $ = cheerio.load(html);
                    const title = $('.shirt-picture > span > img').attr('alt');
                    const price = $('.price').text();
                    const url = `http://${options.hostname}${productPath}`;
                    const imgURL = `http://${options.hostname}/${$('.shirt-picture > span > img').attr('src')}`;
                    const product = new Product(title, price, url, imgURL);
                    products.push(product);
                });
            }
            else {
                // Status code error
                console.log(response.statusCode);
            }
        });
        request.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        request.end();
    }
    catch(error) {
        console.error("there was a URL error");
    }
}

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

function writeFile() {
    fs.writeFile('./data/output.json', JSON.stringify(products, null, 4), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

getProducts();