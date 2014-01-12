
var connection = new Mongo( "ds063178.mongolab.com:63178" );
var db = connection.getDB( "heroku_app21171732" );
db.auth( "bookingapp", "jpr0b00kingapp" );
print( "> MongoLab: connected to the DB." );