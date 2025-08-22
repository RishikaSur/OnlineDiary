import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticateJWT from "../middleware/authenticateJWT.js";
import { getUserByUsername, createUser, getUserByGoogleId } from '../utils/userUtils.js';
import pool from "../db.js";

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ username, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
  console.error('Error in /auth/register:', err);
  res.status(500).json({ message: 'Server error' });
}
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const validPwd = await bcrypt.compare(password, user.password_hash);
    if (!validPwd) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
  console.error('Error in /auth/login:', err);
  res.status(500).json({ message: 'Server error' });
}
});

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  (req, res) => {
    // Create JWT token for user
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);


router.delete("/delete-account", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user from database
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    // No session to destroy, just send success response
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
