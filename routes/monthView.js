var mongoose = require('mongoose')
    , Resource = mongoose.model('Resource')

exports.index = function(request, response){
    Resource.find(function (err, resources) {
        if (err) return next(err)
        if (!resources) return next(new Error('not found'))
        console.log("resources:"+resources);
        response.render('selectResource',{
            title:'Select resource for month view',
            resources:resources
        });
    });
};

exports.showResourceMonthView = function(request, response){
    var resourceId=request.params.resourceId;
    Resource.findById(resourceId,function (err, resource) {
        response.render('monthView',{
            title: 'Reservation.js, monthView',
            resourceName: resource.name,
            resourceId:resourceId
        });
    });

    /*MongoClient.connect(dbURL, function(err, db) {
        if(err) throw err;
        db.collection(collectionName).findOne({"_id":ObjectID(resourceId)}, {'name':true}, function(err, document){
            //console.log("resourceId:"+resourceId);
            res.render('monthView', {
                title: 'Reservation.js, monthView',
                resourceId: resourceId,
                resourceName: document.name
            });
        });
    });*/
};



