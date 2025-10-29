import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        // token expired or invalid: logout
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
    load();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full border rounded p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Welcome{user ? `, ${user.name}` : ''}!</h1>
        <p className="text-sm text-gray-600 mb-4">You are logged in with {user?.email}</p>
        <button onClick={handleLogout} className="p-2 bg-gray-700 text-white rounded">Logout</button>
      </div>
    </div>
  );
}
