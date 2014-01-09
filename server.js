
var fs = require('fs')
var express = require('express');
var routes = require('./routes');
var timelineData = require('./routes/timelineData');
var http = require('http');
var path = require('path');
var config = require('nconf').file({ file: 'config.json' });

moment = require('moment');
mongoose = require('mongoose');
collectionName='resourcereservations';
dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||(config.get('dbURI'));
Schema = mongoose.Schema;

// Define models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
    console.log("loading model "+(models_path + '/' + file))
})
var monthView = require('./routes/monthView'); //monthView depends on the models
var bookings = require('./routes/bookings'); // booking  depends on the models



MongoClient = require('mongodb').MongoClient, format = require('util').format, ObjectID = require('mongodb').ObjectID;
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    mongoose.connect(dbURL, options)
}
connect()
mongoose.connection.on('disconnected', function () {
    connect()
})


var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.errorHandler());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('r3servation'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//define REST API
app.get('/', routes.index);
app.get('/timelineData', timelineData.index);
app.get('/bookings/:resourceId/:yearMonth', bookings.list);
app.put('/bookings', bookings.new);
app.post('/bookings/move/:bookingId', bookings.move);
app.post('/bookings/change/:bookingId', bookings.changeDates);
app.get('/monthView', monthView.index);
app.get('/monthView/:resourceId', monthView.showResourceMonthView);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


global.toDate=function toDate(momentDate){
    return new Date(momentDate.year(),momentDate.month(),momentDate.date());
}

