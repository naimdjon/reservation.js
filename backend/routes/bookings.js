
exports.list = function (request, response) {
    var resourceId = request.params.resourceId;
    var from = request.params.from;
    var to = moment(from).add('d', 40).format('YYYY-MM-DD');
    console.log("resourceId:" + resourceId+",from:"+from+", to:"+to);
    Booking.find({resourceId:resourceId})
        .where('from').gte(from).lt(to)
        .where('to').lte(to)
        .exec(function (err, bookings) {
            if (err) return next(err)
            if (!bookings) return next(new Error('not found'))
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
            response.end(JSON.stringify(bookings));
        });
}

exports.new = function (request, response) {
    console.dir(request.body);
    var resourceId = request.body.resourceId;
    var email = request.body.userEmail;
    var from = request.body.from;
    var to = request.body.to;
    var to_be_cleaned = request.body.to_be_cleaned;

    function formContainsError() {
        var error = "";
        if (!email || !email.length > 0) {
            error = "Missing email (orderer)";
        } else if (!resourceId || !(resourceId.length > 0)) {
            error = "Missing resourceId";
        } else if (!from || !from.length > 0) {
            error = "Missing start date";
        } else if (!to || !to.length > 0) {
            error = "Missing end date";
        }
        return error;
    }
    var error =formContainsError();
    if (error.length > 0) {
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
};
