//////////////////////////MODULES
//his module is able to convert variables into data through a JSON File.
const replaceTemplate = require('./modules/replaceTemplate');
//this module allows the connection with the server
const http = require('http');
//this module allows exploring files in the system
const fs = require('fs');
//this module allows interaction with all the url's
const url = require('url');
const slugify = require('slugify');

//////////////////////////FILES

//we need to create a variable fs = file system  it allows write and create files
/* const fs = require('fs');
//BLOCKING SYNCHRONOUS WAY 
//first parameter is the path and the second one is the encode. 
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

//write a file 
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
console.log(textOut)
fs.writeFileSync('./txt/output.txt', textOut)
console.log('File written') */

//NON-BLOCK SYNCHRONOUS WAY
/* fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    console.log(data1);
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('Your file has been written 😄.');
            });
        });
    });
    console.log('will read file!');
}); */

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
/////////////////////////////////////////SERVER

//CREATE A SERVER
//create server has two parameters request and response
const server = http.createServer((req, res) => {
  //send back a very simple response

  //inside the pathname is the url saved
  const { pathname, query } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'content.type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //PRODUCTS PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content.type': 'application/json' });
    res.end(data);

    //NO TFOUND PAGE
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page no found!</h1>');
  }
});
// listen function has the port parameter, url and a callback function
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening to requests on port 3000');
});

//////////////////////////////////////////ROUTING
