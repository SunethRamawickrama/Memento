'use client';
import { useState } from 'react';

export default function CreateNewMemory() {
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/memories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, person }),
    });

    if (res.ok) {
      setStatus('✅ Memory saved!');
      setTitle('');
      setPerson('');
    } else {
      setStatus('❌ Error saving memory.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Create a New Memory</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
          >
            💾 Save Memory
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
}
