var express = require('express');
var routes = require('./routes');
var timelineData = require('./routes/timelineData');
var monthView = require('./routes/monthView');
var newReservation = require('./routes/newReservation');
var reservationMove = require('./routes/reservationMove');
var reservationChangeDates = require('./routes/reservationChangeDates');
var http = require('http');
var path = require('path');
moment = require('moment');
var config = require('nconf').file({ file: 'config.json' });

collectionName='resourcereservations';
dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||(config.get('dbURI'));

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
app.use(express.cookieParser('r3servation'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/timelineData', timelineData.index);
app.post('/newReservation', newReservation.index);
app.post('/reservationMove', reservationMove.index);
app.post('/reservationChangeDates', reservationChangeDates.index);
app.get('/monthView', monthView.index);
app.get('/monthView/:resourceId', monthView.showResourceMonthView);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


global.toDate=function toDate(momentDate){
    return new Date(momentDate.year(),momentDate.month(),momentDate.date());
}
