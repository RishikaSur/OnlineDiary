import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connected:', res.rows[0]);
  }
});

export default pool;
