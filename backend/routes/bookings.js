
exports.list = function (request, response) {
    var resourceId = request.params.resourceId;
    var from = request.params.from;
    var to = moment(from).add('M', 1).format('YYYY-MM-DD');
    console.log("resourceId:" + resourceId+",from:"+from+", to:"+to);
    Booking.find({resourceId:resourceId})
        .where('from').gte(from)
        .exec(function (err, bookings) {
            if (err) return next(err)
            if (!bookings) return next(new Error('not found'))
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
            response.end(JSON.stringify(bookings));
        });
}

exports.new = function (request, response) {
    console.dir(request.body);
    var error = "";
    var resourceId = request.body.resourceId;
    var email = request.body.userEmail;
    var from = request.body.from;
    var to = request.body.to;
    var to_be_cleaned = request.body.to_be_cleaned;
    if (!email || !email.length > 0) {
        error = "Missing email (orderer)";
    } else if (!resourceId || !(resourceId.length > 0)) {
        error = "Missing resourceId";
    } else if (!from || !from.length > 0) {
        error = "Missing start date";
    } else if (!to || !to.length > 0) {
        error = "Missing end date";
    }
    if (error.length > 0) {
        console.log("An error:" + error);
        response.end(JSON.stringify({"error": error}), 500);
        return;
    }
    var booking =new Booking;
    booking.from=new Date(from);
    booking.to=new Date(to);
    booking.resourceId=resourceId;
    booking.email=email;
    booking.to_be_cleaned=to_be_cleaned;
    console.log("booking.to_be_cleaned:"+booking.to_be_cleaned);
    booking.save(function (err, booking, numberAffected) {
        if (err) error=err;
        response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
        if (parseInt(numberAffected) != 1)
            response.end(JSON.stringify({"error": "Could not insert the booking:" + numberAffected}), 500);
        else
            response.end(JSON.stringify({"newBookingId": booking._id}));
    });



    /*MongoClient.connect(dbURL, function (err, db) {
     if (err) throw err;
     var newReservationId;
     db.collection(collectionName).update(
     {_id: ObjectID(resourceId)}, { $push: {reservations: {_id: (newReservationId = ObjectID()), name: reservationOnName, start: new Date(start), end: new Date(end)}} }
     , function (err, result) {
     res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
     if (parseInt(result) != 1)
     res.end(JSON.stringify({"error": "Could not insert the reservation:" + result}), 500);
     else
     res.end(JSON.stringify({"newReservationId": newReservationId}));
     db.close();
     });
     });*/
};


exports.move = function (req, res) {
    console.dir(req.body);
    var reservationId = req.body.reservationId;
    var resourceId = req.body.resourceId;
    var newStart = moment(req.body.newStart);
    var newEnd = moment(req.body.newEnd);
    console.log("newEnd:" + newEnd);
    var error = "";
    if (newEnd.isBefore(newStart))
        error = "End date before start!";

    if (error && error.length > 0) {
        res.end(JSON.stringify({"error": error}), 500);
        return true;
    }
    console.log('dragging!');
    MongoClient.connect(dbURL, function (err, db) {
        if (err) throw err;
        db.collection(collectionName).update(
            {"reservations._id": ObjectID(reservationId)}, { $set: {"reservations.$.start": toDate(newStart), "reservations.$.end": toDate(newEnd)}}
            , function (err, result) {
                console.log("drag done, result:" + result);
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
                if (parseInt(result) != 1)
                    res.end(JSON.stringify({"error": "Could not insert the reservation:" + result}), 500);
                else
                    res.end("ok\n");
                db.close();
            });

        /*}
         );*/
    });
};


exports.changeDates = function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        if (err) throw err;
        console.dir(req.body);
        var reservationId = req.body.reservationId;
        var resourceId = req.body.resourceId;
        var newStart = moment(req.body.newStart);
        var newEnd = moment(req.body.newEnd);

        db.collection(collectionName).findOne(
            {_id: ObjectID(resourceId)}, {reservations: {$elemMatch: {_id: ObjectID(reservationId)}}}, function (err, result) {
                db.collection(collectionName).update(
                    {"reservations._id": ObjectID(reservationId)}, { $set: {"reservations.$.start": toDate(newStart), "reservations.$.end": toDate(newEnd)}}, function (err, result) {
                        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
                        if (parseInt(result) != 1)
                            res.end(JSON.stringify({"error": "Could not insert the reservation:" + result}), 500);
                        else
                            res.end("ok\n");
                        db.close();
                    });

            }
        );

    });
};


function getEndDateFromStartDate(startDate, numberOfDays) {
    return moment(startDate).add('days', numberOfDays);
}


function diffDates(start, end) {
    var startDate = moment(start);
    var endDate = moment(end);
    var diff = startDate.diff(endDate, 'days');
    return diff / (24 * 3600 * 1000);
    //return  diff;
}

