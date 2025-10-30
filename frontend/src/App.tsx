import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetails from './pages/ExperienceDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Checkout from './pages/Checkout'; // added checkout page
import Confirmation from './pages/Confirmation'; // ✅ added confirmation page

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar visible on all pages */}
      <Navbar />

      <main className="pt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Experiences */}
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetails />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* ✅ Confirmation page */}
          <Route path="/confirmation" element={<Confirmation />} />

          {/* Protected route */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
