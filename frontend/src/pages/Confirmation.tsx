import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refId } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed</h1>
      <p className="text-gray-600 text-lg mb-6">Ref ID: {refId || "N/A"}</p>
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
