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
        const res = await fetch('/api/get-all-memories');
        const data: Memory[] = await res.json();
        setMemories(data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">All Memories</h2>

      <ul className="mt-4 space-y-2">
        {memories.length > 0 ? (
          memories.map((mem, index) => (
            <li key={index} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="font-semibold">{mem.title}</h3>
              <p className="text-sm text-gray-600">With: {mem.person}</p>
              <p className="text-xs text-gray-500">At: {format(parseISO(mem.created_at), 'PPPpp')}</p>
            </li>
          ))
        ) : (
          <p>No memories found.</p>
        )}
      </ul>
    </div>
  );
}
