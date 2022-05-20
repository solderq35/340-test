var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_leeim',
  password        : 'wp3wkdldirl',
  database        : 'cs340_leeim'
});
module.exports.pool = pool;
