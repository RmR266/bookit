import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import authRouter from './routes/auth';
import experiencesRouter, { dummyExperiences } from './routes/experiences';
import bookingRouter from "./routes/bookings";
import Experience from './models/Experience';

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

async function seedExperiences() {
  try {
    const count = await Experience.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding dummy experiences into MongoDB...");
      await Experience.insertMany(dummyExperiences);
      console.log("✅ Seeding complete!");
    } else {
      console.log(`✅ Experiences already exist (${count} found). Skipping seeding.`);
    }
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    await seedExperiences(); // 🌱 run seeding only after DB connects
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
