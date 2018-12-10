var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('indexMap.html');
});

router.get('/yay', require('connect-ensure-login').ensureLoggedIn('/login/twitter'),
  function(req, res){
  res.render('indexMap.ejs', { user: req.user });
});

module.exports = router;
