import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetails from './pages/ExperienceDetails';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation'; 
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
