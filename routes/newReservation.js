
exports.index = function(req, res){
    var error="";
    var resourceId = req.body.resourceId;
    var reservationOnName = req.body.reservationOnName;
    var start = req.body.start;
    var end=req.body.end;
    if(!reservationOnName || !reservationOnName.length>0){
        error="Missing reservee name";
    }else if(!resourceId || !(resourceId.length>0)){
        error="Missing resourceId";
    }else if(!start || !start.length>0){
        error="Missing start date";
    }else if(!end || !end.length>0){
        error="Missing end date";
    }
    if(error.length>0){
        console.log("An error:"+error);
        res.end(JSON.stringify({"error":error}),500);
        return;
    }
    MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        var newReservationId;
        db.collection(collectionName).update(
            {_id:ObjectID(resourceId)}, { $push:{reservations:{_id: (newReservationId = ObjectID()),name:reservationOnName,start:new Date(start),end:new Date(end)}} }
            ,function(err, result){
                res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'  });
                if(parseInt(result)!=1)
                    res.end(JSON.stringify({"error":"Could not insert the reservation:"+result}),500);
                else
                    res.end(JSON.stringify({"newReservationId":newReservationId}));
                db.close();
        });
    });
};