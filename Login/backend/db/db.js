const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'abhishek',
  database: 'login',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Error connecting to database:', err.message));

module.exports = pool;
