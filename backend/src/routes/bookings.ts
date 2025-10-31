import express, { Request, Response } from "express";
import Booking from "../models/booking";
import Experience from "../models/Experience";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, refId, experienceId, date, time, qty = 1 } = req.body;

    // Basic field validation
    if (!name || !email || !refId || !experienceId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // finding the exp
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // looking for matching slot
    const slot = experience.slots.find((s) => s.date === date && s.time === time);
    if (!slot) {
      return res.status(400).json({ message: "Invalid slot selected" });
    }

    // checking if slot has empty space 
    const remaining = slot.capacity - slot.booked;
    if (remaining < qty) {
      return res.status(400).json({ message: "Slot is full or insufficient capacity" });
    }

    // preventing duplicate booking for the same user at the same slot
    const existingBooking = await Booking.findOne({ email, experienceId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    // creating booking on MongoDB
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

    // Incrase book count 
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

router.get("/", async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

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
