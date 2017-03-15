var elasticsearch = require('elasticsearch');
var express = require('express');
var fs = require('fs');
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();
 
const uri = 'http://www.amazon.com/Amok/dp/B01G1XH46M';

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

priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 8.91 
	client.create({
		index: 'Powerbank-price',
		type: 'Powerbank',
		id: 1,
		body: price
		}, function (error, response) {
          console.log("put item successfully.")
	})
});

setInterval(function() {
  checkPrice();
}, 6000000);
