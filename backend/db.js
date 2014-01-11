dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||(bookingConfig.get('dbURI'));
Schema = mongoose.Schema;

MongoClient = require('mongodb').MongoClient, format = require('util').format, ObjectID = require('mongodb').ObjectID;
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    console.log("connected to the DB");
    mongoose.connect(dbURL, options)
}
connect()
mongoose.connection.on('disconnected', function () {
    connect()
})
