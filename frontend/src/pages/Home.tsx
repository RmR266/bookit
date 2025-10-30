import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location?: string;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const res = await api.get('/experiences');
        setExperiences(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExperiences();
  }, []);

  function handleSearch(query: string) {
    if (!query) return setFiltered(experiences);
    setFiltered(
      experiences.filter((exp) =>
        exp.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading experiences...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No experiences found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    {exp.location && (
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                        {exp.location}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {exp.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">
                      From ₹{exp.price}
                    </span>
                    <button className="bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-500 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
