import React, { useEffect, useState } from 'react';

type Experience = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
};

export default function App() {
  const [exps, setExps] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExps() {
      try {
        const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
        const res = await fetch(`${base}/experiences`);
        const data = await res.json();
        setExps(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExps();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">BookIt — Experiences</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {exps.map(e => (
          <div key={e._id} className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold">{e.title}</h2>
            <p className="text-sm text-gray-600">{e.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold">₹{e.price}</span>
            </div>
            {/* link to details page would go here */}
          </div>
        ))}
      </div>
    </div>
  );
}
