var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var httpskeys = require('./config/httpskeys');
var https = require('https');
var fs = require('mz/fs');
var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy;
var twitterConfig = require('./config/twitter');
var secrets = require('./config/secrets');

// https keys
var key = fs.readFileSync(httpskeys.key);
var cert = fs.readFileSync(httpskeys.cert);
var port = 80;
var secport = 443;

// routes
var index = require('./routes/index');
var search = require('./routes/search');
var testGoogle = require('./routes/testGoogle');
var testmap = require('./routes/testmap');
var api = require('./routes/api');

// passport twitter
passport.use(new twitterStrategy({
    consumerKey: twitterConfig.twitterKey,
    consumerSecret: twitterConfig.twitterSecret,
    callbackURL: twitterConfig.twitterCallback,
		userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    proxy: false
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// app initialization
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// bodyParser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// express-session
app.use(require('express-session')({ secret: secrets.sessionSecret, resave: true, saveUninitialized: true }));

// initialize Passport and restore state from session if exists
app.use(passport.initialize());
app.use(passport.session({cookie: { secure: true, httpOnly: true, maxAge: 3600000 }}));

// routes
app.use('/', index);
app.use('/testmap', testmap)
app.post('/search', search);
app.use('/search', search);
app.post('/testGoogle', testGoogle);
app.use('/testGoogle', testGoogle);
app.use('/api', api);

// twitter OAuth mess
app.get('/login/twitter', passport.authenticate('twitter'));
app.get('/login/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/yay');
});
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/login/twitter'),
  function(req, res){
    res.render('profile', { user: req.user });
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

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
