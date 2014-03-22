
var config = require('../../config');

if ( !config.db ) {
  return;
}


if( config.db.type == 'pg' ) {
  var pg = require('pg');
  var connectionString = "pg://brian:1234@localhost/postgres";

  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT name FROM users WHERE email = $1', ['brian@example.com'], function(err, result) {
          assert.equal('brianc', result.rows[0].name);
         done();
       });
    });

}

if (config.db.type == 'sqlite') {

//  if( config.db.file != ':memory:' ) {
//    var fs = require("fs");
//    var exists = fs.existsSync(config.db.file);
//  }

//  var sqlite3 = require('sqlite3').verbose();
  var sqlite3 = require('sqlite3');
  var db = new sqlite3.Database(config.db.file);

  db.serialize( function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();
    
    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
    });
  });

  db.close();

}








