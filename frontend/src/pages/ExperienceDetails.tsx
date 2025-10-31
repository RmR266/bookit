import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getExperienceById, createBooking } from '../services/api';

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
  const [message, setMessage] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await getExperienceById(id as string);
        // backend may return { experience } or the raw object
        const data = response?.experience || response;
        setExp(data);
        const firstSlot = data?.slots?.[0];
        if (firstSlot) setSelectedDate(firstSlot.date);
      } catch (err) {
        console.error('Error loading experience details:', err);
        navigate('/experiences');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, navigate]);

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

  const generateRefId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
};

  // Booking now calls API signature: createBooking(experienceId: string, slot: string)
async function handleConfirm() {
  setMessage('');

  if (selectedSlotIndex === null || !exp || !selectedDate) {
    setMessage('Please select a date and time slot.');
    return;
  }

  const selectedSlot = exp.slots[selectedSlotIndex];
  if (!selectedSlot) {
    setMessage('Invalid slot selected.');
    return;
  }

  const refId = generateRefId();

  navigate('/checkout', {
    state: {
      experience: exp,
      date: selectedSlot.date,
      time: selectedSlot.time,
      qty: quantity,
      refId,
    },
  });
}


  if (loading) return <div className="p-6 text-center">Loading experience...</div>;
  if (!exp) return <div className="p-6 text-center">Experience not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Experience Details */}
        <div className="lg:col-span-2">
          {/* Back Button - made sticky so it remains visible while scrolling */}
          <div className="sticky top-6 z-20">
            <button
              onClick={() => navigate('/')}
              className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 text-gray-700 hover:text-black hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Back to Home</span>
            </button>
          </div>

          {/* Main Image - keep exact size you provided */}
          {exp.images?.[0] && (
            <img
              src={exp.images[0]}
              alt={exp.title}
              className="w-full h-[420px] object-cover rounded-2xl mb-6 shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://via.placeholder.com/1200x700';
              }}
            />
          )}

          <h1 className="text-3xl font-bold mb-2">{exp.title}</h1>
          <p className="text-gray-600 mb-4">{exp.description}</p>

          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Choose date</h3>
            <div className="flex flex-wrap gap-3">
              {dates.map((d) => {
                const isActive = d === selectedDate;
                const label = new Date(d).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
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
                          ? 'bg-yellow-400 border-yellow-400 text-yellow-800'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
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
                    className={`px-4 py-2 rounded-md border text-left flex items-center gap-3 min-w-[160px] transition-all
                      ${
                        soldOut
                          ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-xs text-gray-500">All times are in IST (GMT +5:30)</div>
                    </div>
                    <div className="text-sm">
                      {soldOut ? (
                        <span className="px-2 py-1 text-xs bg-gray-200 rounded">Sold out</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 rounded">{left} left</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* About Section - rounded and slightly transparent */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">About</h3>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 text-sm text-gray-600 shadow-sm">
              Scenic routes, trained guides, and safety briefing. Minimum age 10. Gear and safety
              equipment provided.
            </div>
          </div>

          {message && <div className="mt-4 text-center text-sm text-gray-700">{message}</div>}
        </div>

        {/* Right: Summary Card (make sticky so it stays visible on scroll) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white border rounded-xl p-5 shadow-sm">
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
              disabled={bookingLoading || selectedSlotIndex === null || selectedDate === null}
              className={`w-full py-2 rounded font-semibold transition-all ${
                selectedDate && selectedSlotIndex !== null
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                  : 'bg-gray-300 text-gray-700 cursor-not-allowed'
              }`}
            >
              {bookingLoading ? 'Confirming...' : 'Confirm'}
            </button>

            <div className="text-xs text-gray-400 mt-3">
              By confirming, you agree to the terms and policies. This is a demo booking.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
