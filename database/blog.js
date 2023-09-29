const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  database: 'blog',
  user: 'root',
  password: 'Player.123'
});

module.exports = pool;