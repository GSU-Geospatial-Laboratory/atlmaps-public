/**
 * Module dependencies.
 */

//Add database connection file
var db = require('./db');

//Express and route dependencies
var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

//Authentication dependencies
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


var app = module.exports = express();

var User = db.User;

//Setup session store in mongodb
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
  url: db.uristring, //pulls in db uri
  interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configuration of nodejs server
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({
    secret: 'keyboard cat', //change this for security
    store: store,
    cookie: {
      maxAge: 900000
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/bower_components'));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/maps', routes.maps);
app.get('/maps/create', routes.createmap);
app.get('/maps/:slug', routes.maps);
app.get('/register', routes.register);
app.get('/login', routes.login);

//Authentication
app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }), function(req, res) {
    res.redirect('/');
  });

//Registration
app.post('/register', function(req, res) {
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', {
        account: account
      });
    }
    res.redirect('/');
  });
});
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// JSON API
app.get('/api/layers', api.allLayers);
app.get('/api/layer/:id', api.layer);
app.get('/api/layers/type/:type', api.layers);
app.get('/api/layers/keyword/:keyword', api.layers);
app.get('/api/layers/collection/:collection', api.layers);
app.get('/api/collections', api.collections);
app.get('/api/collections/:collection', api.collections);
app.get('/api/maps', api.maps);
app.get('/api/maps/user:/_user', api.maps);
app.get('/api/maps/keyword/:keyword', api.maps);
app.get('/api/map/:slug', api.map);
app.put('/api/map', api.saveMap);

// redirect all others to the index
app.get('*', routes.notfound);

// Start server

var port = process.env.PORT || 3000;

exports.App = app;

app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});