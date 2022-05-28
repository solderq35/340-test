var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-east-05.cleardb.net',
  user            : 'ba86a3bbb7c52c',
  password        : 'f0a9b9239bcbb42',
  database        : 'heroku_14a6fb8a75d52d2'
});
module.exports.pool = pool;