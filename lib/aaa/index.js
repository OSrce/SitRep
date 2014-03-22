
var config = require('../../config');

var express = require('express');
var app = module.exports = express();

var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var OpenIDGoogleStrategy = require('passport-google').Strategy;



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
  returnURL: config.web.baseUrl+'/auth/openid/return',
  realm: config.web.baseUrl+'/'
},
function(identifier, done) {
  User.findOrCreate({ openId: identifier }, function(err, user) {
    done(err, user);
  });
}
));
                               
passport.use(new OpenIDGoogleStrategy({
  returnURL: config.web.baseUrl+'/auth/google/return',
  realm: config.web.baseUrl+'/'
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

app.get('/login', function(req,res) {
  res.render('template_login');
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
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  function(req, res) {
//    console.log("passport-google return");
//    console.dir(req.user);
    // Successful authentication, redirect home.
//    res.user = req.user;
    
    res.redirect('/');
  });


app.get('/logout', function(req, res){
    req.logout();
      res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
//  console.log("ensureAuthenticated called!"); 
//  console.dir(req.user);
  if (config.authentication_type=='none' || req.isAuthenticated()) { return next(); }
  console.log("isNotAuthenticated");
  res.redirect('/login');
}















