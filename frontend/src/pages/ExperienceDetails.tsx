import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        const data = await getExperienceById(id as string);
        setExp(data);
        // default date selection to first available date
        const firstSlot = data?.slots?.[0];
        if (firstSlot) setSelectedDate(firstSlot.date);
      } catch (err) {
        console.error(err);
        navigate('/experiences');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  // derive unique dates from slots
  const dates = useMemo(() => {
    if (!exp) return [];
    const unique = Array.from(new Set(exp.slots.map((s) => s.date)));
    return unique;
  }, [exp]);

  // times for selected date with original slot indices (so we have index for booking)
  const timesForSelectedDate = useMemo(() => {
    if (!exp || !selectedDate) return [];
    return exp.slots
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => s.date === selectedDate);
  }, [exp, selectedDate]);

  const subtotal = useMemo(() => {
    if (!exp) return 0;
    return exp.price * quantity;
  }, [exp, quantity]);

  // taxes: example 6% tax (adjust as per spec)
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
    setMessage('');
    if (selectedSlotIndex === null || !exp) {
      setMessage('Please select a date and time slot.');
      return;
    }

    const absoluteSlotIndex = selectedSlotIndex; // in our implementation selectedSlotIndex is absolute index in exp.slots
    setBookingLoading(true);
    try {
      // using dummy booking API — createBooking expects experienceId, slotIndex, name, email
      const res = await createBooking({
        experienceId: exp._id,
        slotIndex: absoluteSlotIndex,
        name: 'Guest User',
        email: 'guest@example.com',
      });
      setMessage(res.message || 'Booking confirmed!');
      // If using DB model, you would probably navigate to a result page with booking id
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading experience...</div>;
  if (!exp) return <div className="p-6 text-center">Experience not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: main content */}
        <div className="lg:col-span-2">
          {/* image */}
          {exp.images?.[0] && (
            <img
              src={exp.images[0]}
              alt={exp.title}
              className="w-full h-72 object-cover rounded-lg mb-6 shadow"
            />
          )}

          <h1 className="text-2xl font-bold mb-2">{exp.title}</h1>
          <p className="text-gray-600 mb-4">{exp.description}</p>

          {/* Choose date chips */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Choose date</h3>
            <div className="flex flex-wrap gap-3">
              {dates.map((d) => {
                const isActive = d === selectedDate;
                // show short friendly date label if you want: Oct 22 -> formatted
                const label = new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      // reset selected slot when date changes
                      setSelectedSlotIndex(null);
                    }}
                    className={`px-3 py-2 rounded-md border ${
                      isActive ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose time */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Choose time</h3>
            <div className="flex flex-wrap gap-3">
              {timesForSelectedDate.map((slot) => {
                const left = slot.capacity - slot.booked;
                const absoluteIndex = slot.idx;
                const isSelected = selectedSlotIndex === absoluteIndex;
                const soldOut = left <= 0;
                return (
                  <button
                    key={absoluteIndex}
                    onClick={() => !soldOut && setSelectedSlotIndex(absoluteIndex)}
                    disabled={soldOut}
                    className={`px-4 py-2 rounded-md border text-left flex items-center gap-3 min-w-[160px] ${
                      soldOut
                        ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200'
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

          {/* About / notes */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">About</h3>
            <div className="bg-white p-4 rounded border text-sm text-gray-600">
              Scenic routes, trained guides, and safety briefing. Minimum age 10. Gear and safety equipment provided.
            </div>
          </div>

          {message && <div className="mt-4 text-center text-sm text-gray-700">{message}</div>}
        </div>

        {/* Right: summary card */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-5 shadow-sm sticky top-6">
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
