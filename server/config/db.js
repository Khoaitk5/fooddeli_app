const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Load file .env đúng thư mục

const { Pool } = require('pg');


const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  ssl: false, // tắt SSL vì Cloud SQL instance dev mặc định không yêu cầu
});

pool.connect()
  .then(() => console.log("✅ Connected to Google Cloud SQL PostgreSQL!"))
  .catch(err => console.error("❌ Connection error:", err.message));

module.exports = pool;
