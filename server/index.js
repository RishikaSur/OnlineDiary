import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';

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
app.use(session({
  secret: process.env.SESSION_SECRET || 'some_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/diary', diaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
