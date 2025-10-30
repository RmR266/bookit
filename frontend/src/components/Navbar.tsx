import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user is on home page
  const isHome = location.pathname === "/" || location.pathname === "/experiences";

  // Handle typing — instant search only on home
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (isHome) {
      const params = new URLSearchParams(window.location.search);
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      navigate(`/?${params.toString()}`, { replace: true });
    }
  };

  // Handle pressing Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (isHome) {
      const params = new URLSearchParams(window.location.search);
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      navigate(`/?${params.toString()}`);
    } else {
      // Redirect to home with search term
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    }
  };

  // When route changes, update the search bar value (keep it synced)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
  }, [location.search]);

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
        onSubmit={handleSubmit}
        className="flex items-center space-x-3 w-full sm:w-auto sm:max-w-md mt-3 sm:mt-0"
      >
        <input
          type="text"
          placeholder="Search experiences"
          value={query}
          onChange={handleChange}
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
