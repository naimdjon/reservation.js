
exports.index = function(req, res){
  MongoClient.connect(dbURL, function(err, db) {
      if(err) throw err;
      db.collection(collectionName).find({}, {'name':true}).toArray(function(err, results) {
          res.render('selectResource',{
              title:'Select resource for month view',
              resources:results
          });
      });

  });
};

exports.showResourceMonthView = function(req, res){
    daysOfWeek=[];
    for (var i =0; i<7; i++)
        daysOfWeek.push(moment().day(i+1).format('ddd'));
    var resourceId=req.params.resourceId;
    MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        db.collection(collectionName).findOne({"_id":ObjectID(resourceId)}, {'name':true}, function(err, document){
            //console.log("resourceId:"+resourceId);
            res.render('monthView', {
                title: 'Reservation.js, monthView',
                resourceId: resourceId,
                resourceName: document.name,
                daysOfWeek:daysOfWeek//not used right now, since the view is rendered with angular.
            });
        });
    });
};



