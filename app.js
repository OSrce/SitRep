//
//
//
//
//


var express = require('express');
var app = express();

var hbs = require('hbs');

var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var OpenIDGoogleStrategy = require('passport-google').Strategy;

var mySiteUrl = 'localhost';

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard blah' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

//TEMP since we're only using the 'google' user info now
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});




passport.use(new OpenIDStrategy({
  returnURL: 'http://'+mySiteUrl+':3000/auth/openid/return',
  realm: 'http://'+mySiteUrl+'":3000/'
},
function(identifier, done) {
  User.findOrCreate({ openId: identifier }, function(err, user) {
    done(err, user);
  });
}
));
                               
passport.use(new OpenIDGoogleStrategy({
  returnURL: 'http://localhost:3000/auth/google/return',
  realm: 'http://localhost:3000/'
},

  //WHAT I SHOULD BE USING (with my own Users class
//function(identifier, done) {
//  User.findByOpenID({ openId: identifier }, function (err, user) {
//    return done(err, user);
//  });
//}

  // TEMP FOR PROOF OF CONCEPT
function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }

));


app.set('view engine', 'html');
app.engine('html', hbs.__express);


//app.get('/', function(req, res) {
//  res.render('index');
//});

app.get('/',
//       passport.authorize('base-auth', { failureRedirect: '/login' } )
//        passport.authenticate('google',  { failureRedirect: '/login' } ),
        ensureAuthenticated,
        function(req, res) {
//             res.json({ id: req.user.id, username: req.user.username });
            res.render('index');
        }
);

app.get('/login', function(req,res) {
  res.render('login');
});


// Accept the OpenID identifier and redirect the user to their OpenID
// provider for authentication.  When complete, the provider will redirect
// the user back to the application at:
//     /auth/openid/return
app.post('/auth/openid', passport.authenticate('openid'));

// The OpenID provider has redirected the user back to the application.
// Finish the authentication process by verifying the assertion.  If valid,
// the user will be logged in.  Otherwise, authentication has failed.
app.get('/auth/openid/return', 
  passport.authenticate('openid', { successRedirect: '/',
                                    failureRedirect: '/login' }));

app.get('/auth/google',
  passport.authenticate('google'));

app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.get('/logout', function(req, res){
    req.logout();
      res.redirect('/');
});



app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}






