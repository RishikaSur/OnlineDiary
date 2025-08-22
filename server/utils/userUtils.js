import pool from '../db.js'; // Your Postgres pool or client

export async function getUserByUsername(username) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
}


export async function createUser({ username, password }) {
    try{
        const res = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *', [username, password]);
        return res.rows[0];
    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
    
}

export async function getUserByGoogleId(googleId) {
  const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return res.rows[0];
}

export async function createUserWithGoogle(profile) {
  const username = profile.emails[0].value.split('@')[0]; // simple username from email
  const googleId = profile.id;
  const res = await pool.query('INSERT INTO users (username, google_id) VALUES ($1, $2) RETURNING *', [username, googleId]);
  return res.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}
