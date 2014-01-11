var mongoose = require('mongoose')
    , Resource = mongoose.model('Resource')

exports.index = function(request, response){
    //console.log("monthView.index:::::");
    //console.dir(request.session);
    console.log("request.session.resourceId:"+request.session.resourceId);
    if(request.session.resourceId) {
        request.params.resourceId=request.session.resourceId;
        exports.showResourceMonthView(request,response);

    }else
        Resource.find(function (err, resources) {
            if (err) return next(err)
            if (!resources) return next(new Error('not found'))
            response.render('selectResource',{
                userEmail:request.session.auth?request.session.auth.google.user.email:"",
                title:'Select resource for month view',
                resources:resources
            });
        });
};

exports.showResourceMonthView = function(request, response){
    //console.dir(request.session);
    console.log("user:"+request.session.user);
    var resourceId=request.params.resourceId;
    request.session.resourceId=resourceId;
    Resource.findById(resourceId,function (err, resource) {
        response.render('index',{
            userEmail:request.session.auth?request.session.auth.google.user.email:"",
            title: 'Booking.js, ',
            resourceName: resource.name,
            resourceId:resourceId
        });
    });
};



