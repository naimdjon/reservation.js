GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });});

var host="http://reservation-js.herokuapp.com/";
//var host="http://localhost:8000/";
passport.use(new GoogleStrategy({
        returnURL: host+'auth/google/return',
        realm: host
    },
    function(identifier, profile, done) {
        var email=profile.emails[0].value;
        User.findById(email, function(err, user) {
            console.log("user:::"+user);
            console.log("err:::"+err);
            if(!user){
                user =new User;
                user._id=email;
                user.email=email;
                user.name=profile.displayName;
                user.save();
            }
            return done(err, user);
        });
    }
));


exports.loginFilter=function(req, res, next) {
    if (!req.session.passport && req.session.passport.user){
        req.session.user = req.session.passport.user;
    }

    if (req.session.user) {
        next();
        req.session.error = '';
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/auth/google');
    }
}

