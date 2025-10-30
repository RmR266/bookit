import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getExperienceById, createBooking } from "../services/api";

interface Slot {
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  location?: string;
  slots: Slot[];
}

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getExperienceById(id as string);
        setExp(data);
        const firstSlot = data?.slots?.[0];
        if (firstSlot) setSelectedDate(firstSlot.date);
      } catch (err) {
        console.error(err);
        navigate("/experiences");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const dates = useMemo(() => {
    if (!exp) return [];
    return Array.from(new Set(exp.slots.map((s) => s.date)));
  }, [exp]);

  const timesForSelectedDate = useMemo(() => {
    if (!exp || !selectedDate) return [];
    return exp.slots
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => s.date === selectedDate);
  }, [exp, selectedDate]);

  const subtotal = useMemo(() => (exp ? exp.price * quantity : 0), [exp, quantity]);
  const TAX_RATE = 0.06;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  function incQuantity() {
    setQuantity((q) => Math.min(q + 1, 10));
  }

  function decQuantity() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  async function handleConfirm() {
    setMessage("");
    if (selectedSlotIndex === null || !exp) {
      setMessage("Please select a date and time slot.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await createBooking({
        experienceId: exp._id,
        slotIndex: selectedSlotIndex,
        name: "Guest User",
        email: "guest@example.com",
      });
      setMessage(res.message || "Booking confirmed!");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading experience...</div>;
  if (!exp) return <div className="p-6 text-center">Experience not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Experience Details */}
        <div className="lg:col-span-2 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute -top-14 left-0 flex items-center gap-2 px-4 py-2 rounded-full
                       bg-white/90 backdrop-blur-sm shadow border border-gray-200
                       text-gray-700 hover:text-black hover:shadow-md hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Home</span>
          </button>

          {/* Larger Image Display */}
          {exp.images?.[0] && (
            <img
              src={exp.images[0]}
              alt={exp.title}
              className="w-full h-[500px] object-cover rounded-xl mb-8 shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/1200x700";
              }}
            />
          )}

          <h1 className="text-3xl font-bold mb-3">{exp.title}</h1>
          <p className="text-gray-600 mb-6">{exp.description}</p>

          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Choose date</h3>
            <div className="flex flex-wrap gap-3">
              {dates.map((d) => {
                const isActive = d === selectedDate;
                const label = new Date(d).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlotIndex(null);
                    }}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Choose time</h3>
            <div className="flex flex-wrap gap-3">
              {timesForSelectedDate.map((slot) => {
                const left = slot.capacity - slot.booked;
                const isSelected = selectedSlotIndex === slot.idx;
                const soldOut = left <= 0;
                return (
                  <button
                    key={slot.idx}
                    onClick={() => !soldOut && setSelectedSlotIndex(slot.idx)}
                    disabled={soldOut}
                    className={`px-5 py-2 rounded-md border text-left flex items-center gap-3 min-w-[160px] transition-all
                      ${
                        soldOut
                          ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-xs text-gray-500">
                        All times are in IST (GMT +5:30)
                      </div>
                    </div>
                    <div className="text-sm">
                      {soldOut ? (
                        <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                          Sold out
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 rounded">
                          {left} left
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ✅ Compact About Section */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-900">About</h3>
            <div className="bg-gray-100 text-gray-700 text-sm rounded-md px-4 py-2 leading-relaxed shadow-sm">
              Scenic routes, trained guides, and safety briefing. Minimum age 10. Gear and
              safety equipment provided.
            </div>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-gray-700">{message}</div>
          )}
        </div>

        {/* Right: Summary Card */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-50 border rounded-lg p-5 shadow-sm sticky top-6 select-none cursor-default">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">Starts at</div>
              <div className="text-lg font-semibold">₹{exp.price}</div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">Quantity</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={decQuantity}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  aria-label="decrease"
                >
                  −
                </button>
                <div className="px-3">{quantity}</div>
                <button
                  onClick={incQuantity}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  aria-label="increase"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <div>Subtotal</div>
              <div>₹{subtotal}</div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <div>Taxes</div>
              <div>₹{taxes}</div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-lg font-bold">₹{total}</div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={bookingLoading || selectedSlotIndex === null}
              className="w-full py-2 rounded bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold"
            >
              {bookingLoading ? "Confirming..." : "Confirm"}
            </button>

            <div className="text-xs text-gray-400 mt-3">
              By confirming, you agree to the terms and policies. This is a demo
              booking.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
