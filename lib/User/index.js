
//var db = require('bookshelf').PG;

var Bookshelf = require('bookshelf').PG;


//var User = db.Model.extend({
var User = Bookshelf.Model.extend({
    tableName: 'user'
});


module.exports = User;















