var moment = require('moment');
exports.setNewStartDate = function(req, res){
    console.dir(req.body);
    var reservationId = req.body.reservationId;
    var newStart = moment(req.body.newStart);
    var newEnd = getEndDate(newStart,4);
    MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        db.collection(collectionName).update(
            {"reservations._id":ObjectID(reservationId)}, { $set:{"reservations.$.start":toDate(newStart),"reservations.$.end":toDate(newEnd)}},function(err, result){
                console.log("err:"+err);
                console.log("result:"+result);
                res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'  });
                if(parseInt(result)!=1)
                    res.end(JSON.stringify({"error":"Could not insert the reservation:"+result}),500);
                else
                    res.end("ok\n");
                db.close();
        });
    });
};


function getEndDate(startDate,numberOfDays){
    return moment(startDate).add('days',numberOfDays);
}

function toDate(momentDate){
    return new Date(momentDate.year(),momentDate.month(),momentDate.date());
}
