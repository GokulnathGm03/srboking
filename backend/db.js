require('dotenv').config();
const mysql = require('mysql2');

console.log("Connecting to database:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')); // Safely log URL

const pool = mysql.createPool(process.env.DATABASE_URL);

const promisePool = pool.promise();

// Test the connection
promisePool.query('SELECT 1')
    .then(() => {
        console.log('Successfully connected to Railway MySQL database!');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

module.exports = promisePool;
