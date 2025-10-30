import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Details</span>
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
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition">
              Apply
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="terms" className="w-4 h-4" />
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
              <span className="font-medium text-gray-900">Kayaking</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Date</span>
              <span className="text-gray-900">2025-10-22</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Time</span>
              <span className="text-gray-900">09:00 am</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Qty</span>
              <span className="text-gray-900">1</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span className="text-gray-900">₹999</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Taxes</span>
              <span className="text-gray-900">₹59</span>
            </div>

            {/* Divider */}
            <hr className="border-gray-300 my-2" />

            <div className="flex justify-between text-lg font-semibold mt-3 mb-4">
              <span>Total</span>
              <span>₹958</span>
            </div>
          </div>

          <button className="w-full py-3 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition">
            Pay and Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
