//
// file left for reference. Need to reinitialize route before use
//

var express = require('express');
var router = express.Router();
var request = require('request');
var google = require('../config/google');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var searchWhitelist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 1234567890,';

//var htmlPage = require

var temp;

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

router.get('/', function(req, res, next) {
  res.render('testGoogle.html');
});

router.post('/testGoogle', [
  body('origin').trim().whitelist(searchWhitelist),
  body('destination').trim().whitelist(searchWhitelist),
], (req, res, next) => {
  var origin = req.body.origin;
  var destination = req.body.destination;
  console.log(origin);
  console.log(destination);

  // temp variable for the search
  var options = { method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/directions/json',
    qs:
      { key: google.googleAPIkey,
          origin: origin,
          destination: destination,
          mode: 'transit' },
    headers:
      { 'cache-control': 'no-cache' }
  };

  // make the request
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var obj = JSON.parse(body);
    temp = 'The distance between '+origin+' and '+destination+' is '+ obj.routes[0].legs[0].distance.text;
    res.send(temp);
});

});

module.exports = router;
