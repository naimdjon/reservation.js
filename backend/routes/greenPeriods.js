exports.index = function(request, response){
    GreenPeriod.find(function (err, periods) {
        if (err) return next(err)
        response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
        response.end(JSON.stringify(periods));
    });
}

