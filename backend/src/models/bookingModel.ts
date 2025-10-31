import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  promo: String,
  experience: String,
  date: String,
  time: String,
  qty: Number,
  subtotal: Number,
  taxes: Number,
  total: Number,
  refId: String,
});

export default mongoose.model("Booking", bookingSchema);
