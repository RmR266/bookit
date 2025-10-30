import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  images: string[];
  slots: Slot[];
}

export default function ExperienceDetails() {
  const { id } = useParams();
  const [exp, setExp] = useState<Experience | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/experiences/${id}`);
        setExp(res.data.experience);
      } catch (err) {
        console.error(err);
        navigate('/experiences');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleBooking() {
    if (selectedSlot === null || !exp) return setMessage('Please select a slot.');

    try {
      const res = await api.post('/bookings', {
        experienceId: exp._id,
        slotIndex: selectedSlot,
        name: 'Guest User', // replace with user context if available
        email: 'guest@example.com',
      });
      setMessage(res.data.message || 'Booking successful!');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Booking failed.');
    }
  }

  if (loading) return <div className="p-6 text-center">Loading experience...</div>;
  if (!exp) return <div className="p-6 text-center">Experience not found.</div>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow rounded p-6">
        {exp.images?.[0] && (
          <img src={exp.images[0]} alt={exp.title} className="w-full h-64 object-cover rounded mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2">{exp.title}</h1>
        <p className="text-gray-700 mb-4">{exp.description}</p>
        <p className="text-lg font-semibold mb-6">₹{exp.price}</p>

        <h3 className="text-xl font-semibold mb-2">Available Slots</h3>
        <div className="grid gap-3">
          {exp.slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlot(i)}
              disabled={slot.booked >= slot.capacity}
              className={`border rounded p-3 text-left ${
                selectedSlot === i ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              } ${slot.booked >= slot.capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between">
                <span>{slot.date} — {slot.time}</span>
                <span>{slot.booked}/{slot.capacity} booked</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleBooking}
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>

        {message && <div className="mt-4 text-center text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  );
}
