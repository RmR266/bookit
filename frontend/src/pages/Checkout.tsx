import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [agree, setAgree] = useState(false);
  const [refId, setRefId] = useState("");

  // Dummy experience data (will later come from props or context)
  const booking = {
    experience: "Kayaking",
    date: "2025-10-22",
    time: "09:00 am",
    qty: 1,
    subtotal: 999,
    taxes: 59,
    total: 1058,
  };

  const promoCodes = ["SUMMER10", "EXPLORE20", "ADVENTURE15"];

  // Generate random reference ID
  const generateRefId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleApply = () => {
    if (promo) {
      setIsApplied(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const id = generateRefId();
      setRefId(id);

      const payload = {
        name,
        email,
        promo,
        experience: booking.experience,
        date: booking.date,
        time: booking.time,
        qty: booking.qty,
        subtotal: booking.subtotal,
        taxes: booking.taxes,
        total: booking.total,
        refId: id,
      };

      await api.post("/bookings", payload);

      navigate("/confirmation", { state: { refId: id } });
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const isFormValid = name && email && promo && agree && isApplied;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Checkout</span>
        </button>
      </div>

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left: User Info */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={promo}
              onChange={(e) => {
                setPromo(e.target.value);
                setIsApplied(false);
              }}
              className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Promo Code</option>
              {promoCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <button
              onClick={handleApply}
              disabled={!promo}
              className={`px-5 py-2 rounded-md font-medium ${
                promo ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-600"
              } transition`}
            >
              Apply
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              id="terms"
              className="w-4 h-4"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Experience</span>
              <span className="font-medium text-gray-900">{booking.experience}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Date</span>
              <span className="text-gray-900">{booking.date}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Time</span>
              <span className="text-gray-900">{booking.time}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Qty</span>
              <span className="text-gray-900">{booking.qty}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span className="text-gray-900">₹{booking.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Taxes</span>
              <span className="text-gray-900">₹{booking.taxes}</span>
            </div>

            <hr className="border-gray-300 my-2" />

            <div className="flex justify-between text-lg font-semibold mt-3 mb-4">
              <span>Total</span>
              <span>₹{booking.total}</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-md font-semibold transition ${
              isFormValid
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Pay and Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
