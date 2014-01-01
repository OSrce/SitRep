

var pg = require('pg');
var connectionString = "pg://brian:1234@localhost/postgres";



pg.connect(connectionString, function(err, client, done) {
  client.query('SELECT name FROM users WHERE email = $1', ['brian@example.com'], function(err, result) {
        assert.equal('brianc', result.rows[0].name);
        done();
      });
  });










