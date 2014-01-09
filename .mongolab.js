
var connection = new Mongo( "ds047468.mongolab.com:47468" );
var db = connection.getDB( "heroku_app18425228" );
db.auth( "naimdjon", "r3s3rvation.js" );
print( "> MongoLab: connected to the DB." );