import express, { Request, Response } from "express";
import Booking from "../models/booking";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

export default router;
