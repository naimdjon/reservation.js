//    "dbURI":"mongodb://naimdjon:r3s3rvation.js@ds047468.mongolab.com:47468/heroku_app18425228?poolSize=2"
var fs = require('fs')
var express = require('express');
var http = require('http');
var path = require('path');
bookingConfig = require('nconf').file({ file: 'config.json' });
moment = require('moment');
mongoose = require('mongoose');
require('./backend/db')
passport = require('passport')
var auth=require('./backend/auth');

// Define models
var models_path = './backend/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file); //console.log("loading model "+(models_path + '/' + file))
})
var routes = require('./backend/routes');
var greenPeriods = require('./backend/routes/greenPeriods');
var bookings = require('./backend/routes/bookings'); // booking  depends on the models

var expressServer = express();


expressServer.set('port', process.env.PORT || 8000);
expressServer.set('views', __dirname + '/frontend/views');
expressServer.set('view engine', 'ejs');
expressServer.use(express.favicon());
expressServer.use(express.errorHandler());
expressServer.use(express.logger('dev'));
expressServer.use(express.cookieParser());
expressServer.use(express.bodyParser());
expressServer.use(express.methodOverride());
expressServer.use(express.session({secret: "r3s3rvation"}));
//expressServer.use(expressServer.router); //does not work with google auth
//expressServer.use(mongooseAuth.middleware());
expressServer.use(require('stylus').middleware(__dirname + '/frontend'));
expressServer.use(express.static(path.join(__dirname, 'frontend')));



expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use(expressServer.router);


//define the routes (REST API) for our app
expressServer.get('/', routes.index);
expressServer.get('/monthView', routes.index);
expressServer.put('/booking', bookings.new);
expressServer.get('/bookings/:resourceId/:from',bookings.list);
expressServer.get('/monthView/:resourceId', routes.showResourceMonthView);
expressServer.get('/r/:resourceId', routes.showResourceMonthView);
expressServer.get('/green_periods/:from::to', greenPeriods.index);


expressServer.get('/auth/google',passport.authenticate('google'));
expressServer.get('/auth/google/return',passport.authenticate('google', {failureRedirect: '/failedLogin'}),function(req, res) {res.redirect('/');});


http.createServer(expressServer).listen(expressServer.get('port'), function(){
  console.log('Express server listening on port ' + expressServer.get('port'));
});
