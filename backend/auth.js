var usersById={};
var nextUserId = 0;

var UserSchema = new Schema({})
    , User;
UserSchema.plugin(mongooseAuth, {
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
});

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

mongoose.model('User', UserSchema);



exports.loginFilter=function(req, res, next) {
    if(req.query.debug && req.session.auth) {
        console.log("---google---");
        console.log(req.session.auth.google.user);
        console.log("is logged in:"+req.session.auth.loggedIn);
    }
    if (!req.session.user && req.session.auth && req.session.auth.loggedIn){
        req.session.user = req.session.auth.google.user;
    }

    if (req.session.user) {
        next();
        req.session.error = '';
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/auth/google');
    }
}

