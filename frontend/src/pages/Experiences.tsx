import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
          Available Experiences
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="border rounded-2xl bg-white shadow hover:shadow-lg transition duration-200 overflow-hidden"
            >
              <img
                src={exp.images?.[0] || "https://via.placeholder.com/400x250"}
                alt={exp.title}
                className="h-48 w-full object-cover block"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
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
      </div>
    </div>
  );
}
