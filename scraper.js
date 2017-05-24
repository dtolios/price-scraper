/** @requires http */
const http = require('http');

/** @requires cheerio */
const cheerio = require('cheerio');

/** @requires writeCSV */
const writeCSV = require('./writeCSV.js');

/**
 * @global
 * HTTP request options for the shirts website
 */
const options = {
    hostname: 'www.shirts4mike.com',
    port: 80,
    path: '/shirts.php',
    method: 'GET',
    headers: {
        'Content-Type': 'text/html'
    }
};

/**
 * @global
 * array of product objects
 */
const products = [];

/**
 * Represents a product.
 * @class
 * @param {string} title - The title of the product
 * @param {float} price - The price of the product
 * @param {string} imgURL - The url of the product's image
 * @param {string} url - The url of the product
 * @param {string} time - The time the product was scraped, formatted in HH:MM:SS:MS
 */
function Product(title, price, imgURL, url, time) {
    this.title = title;
    this.price = price;
    this.imgURL = imgURL;
    this.url = url;
    this.time = time;
}

/**
 * @function getProducts
 * Makes an http request using the global options object and scrapes the /shirts.php entry point for paths to the
 * product detail pages. Then calls getProduct() for each product path
 */
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
                    const $productList = $('.products li');
                    const numProducts = $productList.length;

                    $productList.each((i, elem) => {
                        const productPath = $(elem).children('a').attr('href');
                        getProduct(productPath, numProducts);
                    });


                });
            }
            else {
                // Status code error
                console.error(`There has been a ${response.statusCode} error. Error: ${http.STATUS_CODES[response.statusCode]}`);
            }
        });
        request.on('error', (e) => {
            console.error(`Cannot connect to ${options.hostname}.\n Error message: ${e.message}`);
        });
        request.end();
    }
    catch(error) {
        // Malformed URL Error
        console.error("There was a URL error");
    }
}

/**
 * @function getProducts
 * Makes an http request and changes the options.path member to the value of argument 'productPath'
 * productPath represents the path to the product detail page.
 * @param {string} productPath - the path to the product detail page
 * @param {int} numProducts - the number of products on the shirts.php page (aka the number of list items in ul.products)
 */
function getProduct(productPath, numProducts) {
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
                    const $productIMG = $('.shirt-picture > span > img');
                    const title = $productIMG.attr('alt');
                    const price = $('.price').text();
                    const imgURL = `http://${options.hostname}/${$productIMG.attr('src')}`;
                    const url = `http://${options.hostname}/${productPath}`;
                    const date = new Date();
                    const isoTimeString = date.toISOString();
                    products.push(new Product(title, price, imgURL, url, isoTimeString));
                    if(products.length === numProducts) {
                        writeCSV.saveData('./data', products);
                    }
                });
            }
            else {
                // Status code error
                console.error(`There has been a ${response.statusCode} error. Error: ${http.STATUS_CODES[response.statusCode]}`);
            }
        });
        request.on('error', (e) => {
            console.error(`Cannot connect to ${options.hostname}.\n Error message: ${e.message}`);
        });
        request.end();
    }
    catch(error) {
        console.error("There was a URL error");
    }
}


module.exports.scrapeProducts = getProducts;