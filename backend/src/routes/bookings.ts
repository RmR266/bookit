import express, { Request, Response } from "express";
import Booking from "../models/booking";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking entry
 * @access  Public (you can later protect it with auth middleware if needed)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;

    if (!bookingData.name || !bookingData.email || !bookingData.refId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create(bookingData);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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
