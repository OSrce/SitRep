//
//
//
//
//


var express = require('express');
var app = express();

var passport = require('passport');                    
var hbs = require('hbs');


app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
//  app.use(require('connect-multipart')());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard blah' }));
  app.use(passport.initialize());                       
  app.use(passport.session());  
  
  app.use(app.router);
});

//module style:
//var db = require('./lib/db');
var aaa = require('./lib/aaa');


//app.use(db);
app.use(aaa);


app.set('view engine', 'html');
app.engine('html', hbs.__express);


//app.get('/', function(req, res) {
//  res.render('index');
//});

app.get('/',
//       passport.authorize('base-auth', { failureRedirect: '/login' } )
//        passport.authenticate('google',  { failureRedirect: '/login' } ),
        aaa.ensureAuthenticated,
        function(req, res) {
//             res.json({ id: req.user.id, username: req.user.username });
            res.render('index');
        }
);



app.listen(3000);







