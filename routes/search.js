var express = require('express');
var router = express.Router();


router.post('/search', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var msg = req.body.msg;
  res.json({"name":name,"email":email,"msg":msg});
});

router.get('/', function(req, res, next) {
  res.send('testing');
});

/*
module.exports = {
    test: function(){
        console.log("Hello world.");
    }
};
*/

module.exports = router;

