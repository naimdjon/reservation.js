exports.index = function(request, response){
    if(!request.session.auth) {
        response.render('login');
        return;
    }else  if(request.session.resourceId) {
        request.params.resourceId=request.session.resourceId;
        exports.showResourceMonthView(request,response);
    }else{
        Resource.find(function (err, resources) {
            if (err) return next(err)
            if (!resources) return next(new Error('not found'))
            request.session.resources=resources;
            response.render('selectResource',{
                userEmail:request.session.auth?request.session.auth.google.user.email:"",
                title:'Select resource for month view',
                resources:resources
            });
        });
    }
};

exports.showResourceMonthView = function(request, response){
    if(!request.session.auth) {
        response.render('login');
        return;
    }
    var resourceId=request.params.resourceId;
    request.session.resourceId=resourceId;
    Resource.findById(resourceId,function (err, resource) {
        response.render('index',{
            userEmail:request.session.auth?request.session.auth.google.user.email:"",
            title: 'Booking.js, ',
            resourceName: resource.name,
            resources:request.session.resources,
            resourceId:resourceId
        });
    });
};



