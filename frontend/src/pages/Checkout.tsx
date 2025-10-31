import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { applyPromo } from '../services/api';

interface CheckoutState {
  experience: {
    _id: string;
    title: string;
    price: number;
  };
  date: string;
  time: string;
  qty: number;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as CheckoutState | null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Redirect if accessed directly
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const TAX_RATE = 0.06;
  const subtotal = bookingData.experience.price * bookingData.qty;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = Math.round(subtotal + taxes - discount);

  async function handleApplyPromo() {
    if (!promo) return;
    try {
      const res = await applyPromo(promo);
      if (res.valid) {
        setDiscount(res.discountAmount || 0);
        setPromoApplied(true);
      } else {
        setError('Invalid promo code');
      }
    } catch (err) {
      setError('Error applying promo');
    }
  }

  function handlePayAndConfirm() {
    setError('');

    if (!fullName || !email) {
      setError('Please fill all required fields.');
      return;
    }

    if (!agree) {
      setError('Please agree to the terms and safety policy.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          ...bookingData,
          fullName,
          email,
          total,
        },
      });
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Checkout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full mt-1 px-4 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:border-yellow-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full mt-1 px-4 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:border-yellow-400 outline-none"
              />
            </div>
          </div>

          {/* Promo code */}
          <div className="flex items-center gap-2 mb-4">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="flex-1 px-4 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:border-yellow-400 outline-none"
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied}
              className={`px-4 py-2 text-sm rounded-md ${
                promoApplied
                  ? 'bg-green-100 text-green-600 border border-green-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1"
            />
            <label className="text-sm text-gray-600">
              I agree to the <span className="text-yellow-600">terms</span> and{' '}
              <span className="text-yellow-600">safety policy</span>.
            </label>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>

        {/* Right summary box */}
        <aside className="bg-white border rounded-2xl shadow-sm p-6 h-fit">
          <div className="mb-3 text-sm text-gray-600 flex justify-between">
            <span>Experience</span>
            <span className="font-medium text-gray-800">{bookingData.experience.title}</span>
          </div>
          <div className="mb-3 text-sm text-gray-600 flex justify-between">
            <span>Date</span>
            <span>{bookingData.date}</span>
          </div>
          <div className="mb-3 text-sm text-gray-600 flex justify-between">
            <span>Time</span>
            <span>{bookingData.time}</span>
          </div>
          <div className="mb-3 text-sm text-gray-600 flex justify-between">
            <span>Qty</span>
            <span>{bookingData.qty}</span>
          </div>
          <hr className="my-3" />
          <div className="mb-2 text-sm flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="mb-2 text-sm flex justify-between text-gray-600">
            <span>Taxes</span>
            <span>₹{taxes}</span>
          </div>
          {discount > 0 && (
            <div className="mb-2 text-sm flex justify-between text-green-600">
              <span>Promo discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <hr className="my-3" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">₹{total}</span>
          </div>
          <button
            onClick={handlePayAndConfirm}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all"
          >
            {loading ? 'Processing...' : 'Pay and Confirm'}
          </button>
        </aside>
      </div>
    </div>
  );
}
