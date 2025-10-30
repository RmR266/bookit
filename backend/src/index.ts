import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import authRouter from './routes/auth';
import experiencesRouter from './routes/experiences';
import bookingRouter from "./routes/bookings";

const app = express();

// ✅ Correct CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/experiences', experiencesRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
