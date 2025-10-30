import { Router } from 'express';
import Experience from '../models/Experience';
import mongoose from 'mongoose';

const router = Router();

/**
 * POST /api/bookings
 * body: { experienceId, slotIndex, name, email }
 */
router.post('/', async (req, res) => {
  const { experienceId, slotIndex, name, email } = req.body;
  if (!experienceId || slotIndex === undefined || !name || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const exp = await Experience.findById(experienceId).session(session);
    if (!exp) throw new Error('Experience not found');

    const slot = exp.slots[slotIndex];
    if (!slot) throw new Error('Slot not found');

    if (slot.booked >= slot.capacity) {
      throw new Error('Slot is sold out');
    }

    exp.slots[slotIndex].booked += 1;
    await exp.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'Booking confirmed', slot });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
