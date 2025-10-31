import express, { Request, Response } from "express";
import Booking from "../models/booking";
import Experience from "../models/Experience";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking entry and prevent double-booking
 * @access  Public
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, refId, experienceId, date, time, qty = 1 } = req.body;

    // ✅ Basic field validation
    if (!name || !email || !refId || !experienceId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Find the experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // ✅ Find matching slot
    const slot = experience.slots.find((s) => s.date === date && s.time === time);
    if (!slot) {
      return res.status(400).json({ message: "Invalid slot selected" });
    }

    // ✅ Check if slot has capacity left
    const remaining = slot.capacity - slot.booked;
    if (remaining < qty) {
      return res.status(400).json({ message: "Slot is full or insufficient capacity" });
    }

    // ✅ Prevent duplicate booking for same user + slot
    const existingBooking = await Booking.findOne({ email, experienceId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    // ✅ Create the booking
    const booking = await Booking.create({
  name,
  email,
  refId,
  experienceId,
  date,
  time,
  qty,
  promo: req.body.promo,
  subtotal: req.body.subtotal,
  taxes: req.body.taxes,
  total: req.body.total,
});

    // ✅ Update booked count in the Experience slot
    slot.booked += qty;
    await experience.save();

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (for admin/debugging)
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/**
 * @route   GET /api/bookings/:refId
 * @desc    Get a single booking by its Ref ID
 */
router.get("/:refId", async (req: Request, res: Response) => {
  try {
    const { refId } = req.params;
    const booking = await Booking.findOne({ refId });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: "Failed to fetch booking" });
  }
});

export default router;
