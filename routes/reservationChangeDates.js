exports.index = function(req, res){
    MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        console.dir(req.body);
        var reservationId = req.body.reservationId;
        var resourceId = req.body.resourceId;
        var newStart = moment(req.body.newStart);
        var newEnd = moment(req.body.newEnd);

        db.collection(collectionName).findOne(
           {_id:ObjectID(resourceId)},{reservations:{$elemMatch:{_id:ObjectID(reservationId)}}},function(err, result){
               db.collection(collectionName).update(
                   {"reservations._id":ObjectID(reservationId)}, { $set:{"reservations.$.start":toDate(newStart),"reservations.$.end":toDate(newEnd)}},function(err, result){
                       res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'  });
                       if(parseInt(result)!=1)
                           res.end(JSON.stringify({"error":"Could not insert the reservation:"+result}),500);
                       else
                           res.end("ok\n");
                       db.close();
               });

           }
       );

    });
};
