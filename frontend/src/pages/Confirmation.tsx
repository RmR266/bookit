import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const refId = location.state?.refId;

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
      <p className="text-gray-500">Ref ID: {refId || "N/A"}</p>
      <button
        onClick={() => navigate("/home")}
        className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
      >
        Back to Home
      </button>
    </div>
  );
}
