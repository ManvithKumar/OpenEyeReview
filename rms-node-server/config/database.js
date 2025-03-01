const mysql = require("mysql2");

require('dotenv').config();

// Create a connection pool (recommended for performance)
const db = mysql.createPool({
  host: process.env.DATABASE_HOST,      // Change this if using a remote MySQL server
  user: process.env.DATABASE_USER,           // Your MySQL username
  password: process.env.DATABASE_PASSWORD,           // Your MySQL password (keep empty if no password)
  database: process.env.DATABASE_DB,        // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,    // Maximum number of connections
  queueLimit: 0
});

// Check if the connection is successful
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
    connection.release(); 
  }
});

module.exports = db;
