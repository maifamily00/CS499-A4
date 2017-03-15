var elasticsearch = require('elasticsearch');
var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var client = new elasticsearch.Client({
  host: 'https://search-cs499a3-lvz7sdf3cago5jedwyakxrpcae.us-west-1.es.amazonaws.com/',
  log: 'info'
});

client.ping({
  requestTimeout: 5000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

var asin = 'B01G1XH46M';
var amzn_url = 'http://www.amazon.com/dp/' + asin;


request(amzn_url, function(error, response, body) {
   fs.writeFile('product.html', body, function(error) {
      console.log('Page saved!');
   });
});


function checkPrice() {
   request(amzn_url, function(error, response, body) {
      var $ = cheerio.load(body);
      var list_price = $('#actualPriceValue').text();
      var stripped_price = list_price.replace('$', '').replace(',', '');   // remove leading $ and any commas

      console.log(stripped_price);
	  client.create({
		  index: 'Powerbank-price',
		  type: 'Powerbank',
		  id: 1,
		  body: stripped_price
	  }, function (error, response) {
          console.log("put item successfully.")
	  })
   });

}

setInterval(function() {
  checkPrice();
}, 6000000);

var app = express()

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})