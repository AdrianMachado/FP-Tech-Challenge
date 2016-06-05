/*
 * Serve JSON to our AngularJS client
 */
var express     = require('express');
var https       = require('https');
var q           = require('q');
var api         = express.Router();
var db          = require('../config/db').connection;
var parseString = require('xml2js').parseString;

// API endpoint for /api/apparel
api.get('/api/apparel/:styleCode?', function(req, res) {
	//db.connect();
	db.query("SELECT * FROM apparel", function(err, rows, fields){
		console.log(rows);
		console.log(err);
		res.json(rows);
	});

	//db.end();

});

// API endpoint for /api/quote
api.post('/api/quote', function(req, res) {
	// Insert Quoting API code here
	var baseItem = getApparelPrice(req.styleCode, req.colorCode, req.sizeCode);
	var price = baseItem.item.price;
	var SALESMAN_COMPENSATION = 1.07;
	var orderTotal;
	if(baseItem.item.size_code <= 0.4) {
		if(req.quantity < 48){
			price += 1;
		}
		else {
			price += 0.75;
		}
	}
	else {
		if(req.quantity < 48){
			price += 0.5;
		}
		else {
			price += 0.25;
		}
	}

	price = price * SALESMAN_COMPENSATION;
	orderTotal = price * req.quantity;

	if(orderTotal <= 800){
		orderTotal += orderTotal * 0.5;
	}
	else {
		orderTotal += orderTotal * 0.45;
	}

	res.json(orderTotal);



});

// Function for making an Inventory API call
var getApparelPrice = function getPrice(style_code, color_code, size_code) {
	var	apparelPriceDeferred = q.defer();

	// Format the Inventory API endpoint as explained in the documentation
	https.get('https://www.alphashirt.com/cgi-bin/online/xml/invrequest.w?sr='+ style_code + '&cc=' + color_code + '&sc=' + size_code + '&pr=y&zp=20176&userName=testname&password=testpw', function(res) {
		res.on('data', function (data) {
			parseString(data, function (err, result) {
				console.dir(result);
				apparelPriceDeferred.promise = data;
			});

		});
	}).on('error', function(error) {
		// Handle EDI call errors here

	});

	return apparelPriceDeferred.promise;
}

module.exports = api;