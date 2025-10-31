import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { applyPromo, createBooking } from '../services/api';

interface CheckoutState {
  experience: {
    _id: string;
    title: string;
    price: number;
  };
  date: string;
  time: string;
  qty: number;
  refId?: string; // optional in case older flows don't include it
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as CheckoutState | null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  //  Modal state
  const [showPromos, setShowPromos] = useState(false);

  // Redirect if accessed directly
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  //  Price Calculations
  const TAX_RATE = 0.06;
  const subtotal = bookingData.experience.price * bookingData.qty;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = Math.round(subtotal + taxes - discount);

  //  Regex validation
  const nameRegex = /^[A-Za-z\s]{3,}$/; // letters & spaces, at least 3 chars
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isNameValid = nameRegex.test(fullName);
  const isEmailValid = emailRegex.test(email);

  const canPay = useMemo(() => isNameValid && isEmailValid && agree, [isNameValid, isEmailValid, agree]);

  // Apply promo
  async function handleApplyPromo() {
    setError('');
    setSuccessMsg('');
    if (!promo) return;

    try {
      const res = await applyPromo(promo, subtotal);

      if (res.valid) {
        setDiscount(res.discountAmount || 0);
        setPromoApplied(true);
        setSuccessMsg(`Promo "${promo}" applied! You saved ₹${res.discountAmount || 0}.`);
      } else {
        setError('Invalid promo code.');
      }
    } catch {
      setError('Error applying promo.');
    }
  }

  //  Pay & Confirm
  async function handlePayAndConfirm() {
    setError('');
    if (!canPay) {
      setError('Please fill valid details and accept terms.');
      return;
    }

    if (!bookingData) {
      setError('Booking data missing.');
      return;
    }

    setLoading(true);

    try {
      // create a payload 
      const payload = {
        name: fullName,
        email,
        promo: promoApplied ? promo : '',
        experienceId: bookingData.experience._id,
        date: bookingData.date,
        time: bookingData.time,
        qty: bookingData.qty,
        subtotal,
        taxes,
        total,
        refId: bookingData.refId || `REF${Date.now()}`, // fallback refId if not passed
      };

      const res = await createBooking(payload);

      if (res && res.success) {
        // navigate to confirmation with refId
        navigate('/confirmation', {
          state: { refId: payload.refId },
        });
      } else {
        setError(res?.message || 'Booking failed.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error completing booking.');
    } finally {
      setLoading(false);
    }
  }

  //  Available promos 
  const availablePromos = [
    { code: 'SAVE10', desc: 'Get 10% off your booking!' },
    { code: 'FLAT100', desc: 'Flat ₹100 off on any experience!' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(`/experiences/${bookingData.experience._id}`)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base font-medium">Checkout</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className={`w-full mt-1 px-4 py-2 border rounded-md text-sm focus:bg-white outline-none ${
                  isNameValid ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {!isNameValid && fullName.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Enter a valid name (min 3 letters).</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={`w-full mt-1 px-4 py-2 border rounded-md text-sm focus:bg-white outline-none ${
                  isEmailValid ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {!isEmailValid && email.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Enter a valid email address.</p>
              )}
            </div>
          </div>

          {/* Promo code */}
          <div className="flex items-center gap-2 mb-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="flex-1 px-4 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:border-yellow-400 outline-none"
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied}
              className={`px-4 py-2 text-sm rounded-md transition-all ${
                promoApplied
                  ? 'bg-green-100 text-green-600 border border-green-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>

          {/* View available promos */}
          <button
            onClick={() => setShowPromos(true)}
            className="text-sm text-blue-600 underline mb-4 hover:text-blue-800"
          >
            View available promos
          </button>

          {/* Notifications */}
          {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Terms */}
          <div className="flex items-start gap-2 mt-4">
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

          {/* Pay Button */}
          <button
            onClick={handlePayAndConfirm}
            disabled={!canPay || loading}
            className={`w-full font-semibold py-2 rounded-md transition-all ${
              canPay
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Pay and Confirm'}
          </button>
        </aside>
      </div>

      {/*  Promo Modal */}
      {showPromos && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Available Promos</h3>
            <ul className="space-y-2">
              {availablePromos.map((p) => (
                <li
                  key={p.code}
                  className="border p-2 rounded-md hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="text-sm text-gray-700">{p.desc}</span>
                  <code className="font-mono text-sm text-blue-700">{p.code}</code>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPromos(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 rounded-lg py-2 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
