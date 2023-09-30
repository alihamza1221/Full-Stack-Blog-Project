const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12650075',
  password: 'IGZgeBfy3B',
  database: 'sql12650075',
  port: 3306, // Port number for MySQL
});

module.exports = pool;
