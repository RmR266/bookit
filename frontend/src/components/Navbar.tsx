import React from "react";
import logo from "../assets/logo.png"; // adjust path if needed

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Bookit Logo" className="w-12 h-12 object-contain" />
        <h1 className="text-xl font-semibold text-gray-800">Bookit</h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 w-full max-w-md">
        <input
          type="text"
          placeholder="Search experiences"
          className="flex-1 px-4 py-2 rounded-lg bg-white/60 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition">
          Search
        </button>
      </div>
    </nav>
  );
}
