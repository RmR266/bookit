import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import localImages from "../assets/localImages";

interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  location?: string;
  images?: string[];
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  //  Fetch experiences
  useEffect(() => {
    async function loadExperiences() {
      try {
        const res = await api.get("/experiences");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.experiences || [];
        setExperiences(data);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExperiences();
  }, []);

  //  Get search query from URL
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q")?.toLowerCase() || "";
  }, [location.search]);

  //  Filter experiences dynamically
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return experiences;
    return experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(searchQuery) ||
        exp.description.toLowerCase().includes(searchQuery) ||
        exp.location?.toLowerCase().includes(searchQuery)
    );
  }, [experiences, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading experiences...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          {searchQuery ? "Search Results" : "Available Experiences"}
        </h1>

        {filteredExperiences.length === 0 ? (
          <p className="text-center text-gray-500">
            No experiences match your search.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp, index) => (
              <div
                key={exp._id}
                className="border rounded-2xl bg-white shadow hover:shadow-lg transition duration-200 overflow-hidden"
              >
                {/* Image with Unsplash + Local Fallback */}
                <img
                  src={
                    exp.images?.[0] ||
                    localImages[index % localImages.length] ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={exp.title}
                  className="h-48 w-full object-cover block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      localImages[index % localImages.length] ||
                      "https://via.placeholder.com/400x250";
                  }}
                />

                <div className="p-4 flex flex-col justify-between h-40">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {exp.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {exp.description}
                    </p>
                    {exp.location && (
                      <p className="text-xs text-gray-400 mt-1">
                        📍 {exp.location}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-800 font-medium">
                      ₹{exp.price}
                    </span>
                    <button
                      onClick={() => navigate(`/experiences/${exp._id}`)}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer active:scale-95"
                    >
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
