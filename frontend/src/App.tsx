import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetails from './pages/ExperienceDetails';
import Checkout from './pages/Checkout'; // ✅ import added
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar visible on all pages */}
      <Navbar />

      <main className="pt-4">
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Home />} />

          {/* 🧭 Experiences Listing + Details */}
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetails />} />

          {/* 💳 Checkout route added here */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
