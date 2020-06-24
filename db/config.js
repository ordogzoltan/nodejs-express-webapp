// MySQL connection pool előkészítője
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 20,
  database: 'webprog',
  host: 'localhost',
  port: 3306,
  user: 'webprog',
  password: 'webprog',
});

// Az exportált függvény Promise-okba enkapszulálja
// a MySQL felé intézett hívásokat, ezeket könnyebb lekezelni
module.exports = (query, options = []) => new Promise((resolve, reject) => {
  pool.query(query, options, (error, results) => {
    if (error) {
      reject(new Error(`Error while running '${query}: ${error}'`));
    }
    resolve(results);
  });
});
