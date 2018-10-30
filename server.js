var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var httpskeys = require('./config/httpskeys');
const https = require('https');
const fs = require('mz/fs');

// https keys
var key = fs.readFileSync(httpskeys.key);
var cert = fs.readFileSync(httpskeys.cert);
var port = 80;
var secport = 443;

var index = require('./routes/index');
var search = require('./routes/search');
var testGoogle = require('./routes/testGoogle');

var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'client', 'dist', 'client'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Static Folder
app.use(express.static(path.join(__dirname, 'client')))  // angular2 stuff

// bodyParser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use(express.static('public'));
app.use('/', index);
app.post('/search', search);
app.use('/search', search);
app.post('/testGoogle', testGoogle);
app.use('/testGoogle', testGoogle);



// https server
const httpsServer = https.createServer({key:key, cert:cert}, app).listen(secport, function(){
	console.log('Secure magic happening on port ' + secport);
});

// http redirect server
const http = require('http');
const httpApp = express();
httpApp.get('*', function(req, res) {
	res.redirect('https://' + req.headers.host + req.url);
})
const httpServer = http.createServer(httpApp).listen(port, function(){
	console.log('Magic happening on port ' + port);
});
