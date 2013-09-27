exports.timelineData = function(req, res){
    MongoClient.connect(dbURL, function(err, db) {
       if(err) throw err;
       var collection = db.collection(collectionName);
       collection.find().toArray(function(err, results) {
            res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'  });
            res.end(JSON.stringify(results));
            db.close();
          });
       });
};