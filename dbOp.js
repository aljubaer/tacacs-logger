const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'tac_plus_log'
});

module.exports.connection = connection;