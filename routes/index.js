var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //res.send('Testing Index Page');
  res.render('index.html');
});

module.exports = router;

