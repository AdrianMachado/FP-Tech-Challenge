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
	db.query("SELECT * FROM apparel", function(err, rows, fields){
		res.json(rows);//might as well take it all in one shot
	});
});

// API endpoint for /api/quote
api.post('/api/quote', function(req, res) {
	// Insert Quoting API code here
	getApparelPrice(req.body.styleCode, req.body.colorCode, req.body.sizeCode).then(function(item){
		var baseItem = item;
		var price = baseItem.price;
		price = parseFloat(price.substring(1,price.length));//clip off the $, make float for math
		var SALESMAN_COMPENSATION = 1.07;
		var orderTotal;
		if(req.body.weight <= 0.4) {
			if(req.body.quantity < 48){
				price += 1.0;
			}
			else {
				price += 0.75;
			}
		}
		else {
			if(req.body.quantity < 48){
				price += 0.5;
			}
			else {
				price += 0.25;
			}
		}

		price = price * SALESMAN_COMPENSATION;
		orderTotal = price * req.body.quantity;

		if(orderTotal <= 800){
			orderTotal += orderTotal * 0.5;
		}
		else {
			orderTotal += orderTotal * 0.45;
		}
		orderTotal = Math.round(orderTotal*100)/100; //rounding
		res.json(orderTotal);

	})
});

// Function for making an Inventory API call
var getApparelPrice = function getPrice(style_code, color_code, size_code) {
	var	apparelPriceDeferred = q.defer();

	// Format the Inventory API endpoint as explained in the documentation
	var url = 'https://www.alphashirt.com/cgi-bin/online/xml/inv-request.w?sr='+ style_code + '&cc=' + color_code + '&sc=' + size_code + '&pr=y&zp=10002&userName=triggered1111&password=triggered2222';
	console.log(url);
	https.get(url, function(res) {
		res.on('data', function (data) {
			parseString(data, function (err, result) {
				var firstKey = 0;
				for(var key in result['inv-balance'].item[0]){//couldn't reference the first key for some reason, parsing bug
					if(firstKey === 0){
						firstKey = key;
					}
				}
				item = result['inv-balance'].item[0][firstKey];
				apparelPriceDeferred.resolve(item);
			});

		});
	}).on('error', function(error) {
		// Handle EDI call errors here
		console.log(error);

	});

	return apparelPriceDeferred.promise;
}

module.exports = api;