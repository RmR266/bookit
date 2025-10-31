import cors from 'cors';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import experiencesRouter, { dummyExperiences } from './routes/experiences';
import bookingRouter from './routes/bookings';
import promoRouter from './routes/promo';
import Experience from './models/Experience';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://bookit-frontend.onrender.com',
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/api/experiences', experiencesRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/promo', promoRouter);

const PORT = process.env.PORT || 10000;

async function seedExperiences(): Promise<void> {
  try {
    const count = await Experience.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding dummy experiences...');
      await Experience.insertMany(dummyExperiences);
      console.log('✅ Seeding complete!');
    }
  } catch (err: any) {
    console.error('❌ Seeding error:', err);
  }
}

mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedExperiences();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err: any) => console.error('❌ MongoDB connection error:', err));

app.get('/', (_req: Request, res: Response) => {
  res.send('✅ Bookit Backend is Running!');
});
