
var config = {}

config.version = 0.1;

config.siteUrl = 'localhost';

config.web = {};
config.web.useSSL = false; // true or false;
config.web.port = process.env.WEB_PORT || 3000;

config.web.baseUrl = '';
if( config.web.useSSL == true) {
  config.web.baseUrl = 'https://'+config.siteUrl+':'+config.web.port;
} else {
  config.web.baseUrl = 'http://'+config.siteUrl+':'+config.web.port;
}
config.authentication_type = 'none';


config.db = {};
config.db.useBookshelf = true;
//config.db.type = 'sqlite';
//config.db.file = 'theDb.db';  // File to sqlite.db file, use ':memory:' for memory store.
config.db.type = 'pg';
config.db.database = 'nyc_sitrep_t1';
config.db.host = 'localhost';
config.db.user = 'sitrepadmin';
config.db.password = '';

module.exports = config;


