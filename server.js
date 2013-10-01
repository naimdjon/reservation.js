var express = require('express');
var routes = require('./routes');
var timelineData = require('./routes/timelineData');
var newReservation = require('./routes/newReservation');
var reservationMove = require('./routes/reservationMove');
var reservationChangeDates = require('./routes/reservationChangeDates');
var http = require('http');
var path = require('path');
moment = require('moment');

collectionName='resourcereservations';
dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    ('mongodb://naimdjon:r3s3rvation.js@ds047468.mongolab.com:47468/heroku_app18425228');
//var dbURL='mongodb://127.0.0.1:27017/'+collectionName;

MongoClient = require('mongodb').MongoClient, format = require('util').format, ObjectID = require('mongodb').ObjectID;


var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/timelineData', timelineData.timelineData);
app.post('/newReservation', newReservation.newReservation);
app.post('/reservationMove', reservationMove.reservationMove);
app.post('/reservationChangeDates', reservationChangeDates.reservationChangeDates);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


global.toDate=function toDate(momentDate){
    return new Date(momentDate.year(),momentDate.month(),momentDate.date());
}
