import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import experiencesRouter, { dummyExperiences } from './routes/experiences';
import bookingRouter from './routes/bookings';
import promoRouter from './routes/promo';
import Experience from './models/Experience';

dotenv.config();

const app = express();

// --- CORS Setup ---
app.use(cors({
  origin: [
    'http://localhost:5173',                       // for local dev
    'https://bookit-frontend.onrender.com',        // for deployed frontend
  ],
  credentials: true,
}));

// --- Middleware ---
app.use(express.json());

// --- Routes ---
app.use('/api/experiences', experiencesRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/promo', promoRouter);

const PORT = process.env.PORT || 10000;

// --- Seed Dummy Data if Empty ---
async function seedExperiences() {
  try {
    const count = await Experience.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding dummy experiences into MongoDB...');
      await Experience.insertMany(dummyExperiences);
      console.log('✅ Seeding complete!');
    } else {
      console.log(`✅ Experiences already exist (${count} found). Skipping seeding.`);
    }
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

// --- MongoDB Connection & Server Start ---
mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    await seedExperiences();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Health Check Route ---
app.get('/', (_req, res) => {
  res.send('✅ Bookit Backend is Running!');
});
