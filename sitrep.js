//
//
//
//
//

var config = require('./config')


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

//TEMP USE Bookshelf
/*
  var Bookshelf  = require('bookshelf');
  Bookshelf.PG = Bookshelf.initialize({
    client: config.db.type,
    connection: {
				 database : config.db.database,
         host : config.db.host,
         user : config.db.user,
         password : config.db.password,
         charset : 'utf8'
        }
  } );
//END TEMP
*/

//module style:
//var db = require('./lib/db');
var aaa = require('./lib/aaa');
//var User = require('./lib/User');


//app.use(db);
app.use(aaa);
//app.use(User);

//User.forge({item: 'value'}).save();

app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.get('/',
  aaa.ensureAuthenticated,
  function(req, res) {
//             res.json({ id: req.user.id, username: req.user.username });
    res.render('index');
  }
);



app.listen(config.web.port);







