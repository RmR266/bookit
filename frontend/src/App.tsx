import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetails from './pages/ExperienceDetails';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* 🌍 Public Routes */}
      <Route path="/" element={<Home />} /> {/* Landing Page */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* 🧭 Experiences Listing + Details */}
      <Route path="/experiences" element={<Experiences />} />
      <Route path="/experiences/:id" element={<ExperienceDetails />} />

      {/* 🔒 Protected Route */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
