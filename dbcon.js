var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_huangjef',
  password        : 'Yunhai8dog',
  database        : 'cs340_huangjef'
});
module.exports.pool = pool;
