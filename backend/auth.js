/*var usersById={};
var nextUserId = 0;

var UserSchema = new Schema({})
    , User;*/

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
        /*process.nextTick(function () {

         // To keep the example simple, the user's Google profile is returned to
         // represent the logged-in user.  In a typical application, you would want
         // to associate the Google account with a user record in your database,
         // and return that user instead.
         profile.identifier = identifier;
         return done(null, profile);
         });*/
        //return done(null, profile);
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



/*UserSchema.plugin(mongooseAuth, {
    everymodule: {
        everyauth: {
            User: function () {
                return User;
            }
        }
    }
    , google: {
        everyauth: {
            myHostname: 'http://localhost:8000'
            , appId: '306846392053.apps.googleusercontent.com'
            , appSecret: 'sNcE8UscG8OgjVWf45hpypf4'
            , scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            , redirectPath: '/monthView'
            , findOrCreateUser:function (sess, accessToken, extra, googleUser) {
                googleUser.refreshToken = extra.refresh_token;
                googleUser.expiresIn = extra.expires_in;
                console.log("sess:"+sess);
                console.log("accessToken:"+accessToken);
                console.log("extra:");
                console.dir(extra);
                console.dir(googleUser);
                return {id:googleUser.email,name:googleUser.email};
                //return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
            }
        }
    }
});*/



/*
TODO: add use to the DB
function addUser (source, sourceUser) {
    var user;
    if (arguments.length === 1) { // password-based
        user = sourceUser = source;
        user.id = ++nextUserId;
        return usersById[nextUserId] = user;
    } else { // non-password-based
        user = usersById[++nextUserId] = {id: nextUserId};
        user[source] = sourceUser;
    }
    return user;
}*/

//mongoose.model('User', UserSchema);



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

