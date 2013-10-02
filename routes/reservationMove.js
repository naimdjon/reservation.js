exports.index = function(req, res){
    console.dir(req.body);
    var reservationId = req.body.reservationId;
    var resourceId = req.body.resourceId;
    var newStart = moment(req.body.newStart);
    var newEnd = moment(req.body.newEnd);
    console.log("newEnd:"+newEnd);
    var error="";
    if(newEnd.isBefore(newStart))
        error="End date before start!";

    if(error && error.length>0){
        console.log("err!!!!");
        res.end(JSON.stringify({"error":error}),500);
        return true;
    }

    console.log('dragging!');
    MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        /*db.collection(collectionName).findOne(
            {_id:ObjectID(resourceId)},{reservations:{$elemMatch:{_id:ObjectID(reservationId)}}},function(err, result){
                console.log("updating...");*/
                db.collection(collectionName).update(
                    {"reservations._id":ObjectID(reservationId)}, { $set:{"reservations.$.start":toDate(newStart),"reservations.$.end":toDate(newEnd)}}
                    ,function(err, result){
                        console.log("drag done, result:"+result);
                        res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'  });
                        if(parseInt(result)!=1)
                            res.end(JSON.stringify({"error":"Could not insert the reservation:"+result}),500);
                        else
                            res.end("ok\n");
                        db.close();
                });

            /*}
        );*/
    });
};


function getEndDateFromStartDate(startDate,numberOfDays){
    return moment(startDate).add('days',numberOfDays);
}


function diffDates(start,end){
    startDate=moment(start);
    endDate=moment(end);
    var diff = startDate.diff(endDate, 'days');
    return diff/(24*3600*1000);
    //return  diff;
}
