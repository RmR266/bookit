import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <nav className="w-full flex flex-wrap items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-3 cursor-pointer select-none"
      >
        <img src={logo} alt="Bookit Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-xl font-semibold text-gray-800">Bookit</h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center space-x-3 w-full sm:w-auto sm:max-w-md mt-3 sm:mt-0"
      >
        <input
          type="text"
          placeholder="Search experiences"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/60 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
        >
          Search
        </button>
      </form>
    </nav>
  );
}
