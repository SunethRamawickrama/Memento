'use client';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

type Memory = {
  title: string;
  person: string;
  created_at: string;
};

export default function AllMemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get-all-memories');
        const data: Memory[] = await res.json();
        setMemories(data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-purple-700">Memory Book!</h2>

      <ul className="space-y-4">
        {memories.length > 0 ? (
          memories.map((mem, index) => (
            <li key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800">{mem.title}</h3>
              <p className="mt-1 text-sm text-gray-600">With: <span className="font-semibold text-gray-800">{mem.person}</span></p>
              <p className="text-xs text-gray-500">At: {format(parseISO(mem.created_at), 'PPPpp')}</p>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">No memories found.</p>
        )}
      </ul>
    </div>
  );
}
