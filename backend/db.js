require('dotenv').config();
const mysql = require('mysql2');

if (!process.env.DATABASE_URL) {
    console.error("=========================================");
    console.error("CRITICAL ERROR: DATABASE_URL IS NOT SET!");
    console.error("Please add the DATABASE_URL environment");
    console.error("variable in your Railway project Settings -> Variables.");
    console.error("=========================================");
    process.exit(1);
}

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
