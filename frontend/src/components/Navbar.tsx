import React, { useState } from 'react';

export default function Navbar({ onSearch }: { onSearch: (query: string) => void }) {
  const [search, setSearch] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(search.trim());
  }

  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Bookit" className="h-8 w-8" />
        <span className="text-lg font-semibold text-gray-800">Bookit</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search experiences"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1.5 w-64 focus:outline-none focus:ring focus:ring-yellow-300"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-gray-900 font-medium px-4 py-1.5 rounded hover:bg-yellow-500"
        >
          Search
        </button>
      </form>
    </nav>
  );
}
