const fs = require('fs');

const request = require('request');
const cheerio = require ('cheerio');
const csv = require('csv');

const url = 'http://www.shirts4mike.com/';
const dirPath = './data';


try {
    fs.mkdirSync(dirPath);
}
catch(error) {
    if(error.code !== 'EEXIST') {
        throw error;
    }
}

request('http://www.shirts4mike.com/shirts.php', (error, response, body) => {
    if(!error) {
        const $ = cheerio.load(body);

        $('.products li').each((i, elem) => {
            const productPath = $(elem).children('a').attr('href');
            getProduct(productPath);
        });

    }
    else {
        console.log("We've encountered an error: " + error);
    }
});

function getProduct(productPath) {
    const productURL = `${url}${productPath}`;

    request(productURL, (error, response, body) => {
        if(!error) {
            const $ = cheerio.load(body);

            const product = {
                title: $('.shirt-picture > span > img').attr('alt'),
                price: $('.price').text(),
                url: productURL,
                imgURL: `${url}${$('.shirt-picture > span > img').attr('src')}`
            };

            console.log(product);

        }
    });
}