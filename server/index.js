import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';


import authRoutes from './routes/auth.js';
import diaryRoutes from './routes/diary.js';
import './passportConfig.js'; 

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,
}));
app.use(express.json());

// Session middleware for passport (required for OAuth)

app.use(passport.initialize());

app.get("/ping-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.send("DB OK");
  } catch (err) {
    res.status(500).send("DB Error");
  }
});

app.get("/", (req, res) => {
  res.send(" Server is running");
});

// Routes
app.use('/auth', authRoutes);
app.use('/diary', diaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
