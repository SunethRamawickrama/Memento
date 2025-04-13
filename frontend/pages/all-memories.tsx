'use client';
import { useEffect, useState } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';

type Memory = {
  title: string;
  person: string;
  created_at: string;
};

export default function AllMemoriesPage() {
  const [date, setDate] = useState(new Date());
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/get-all-memories');
        const data: Memory[] = await res.json();

        // Filter by selected date
        const selectedDateStr = format(date, 'yyyy-MM-dd');
        const filtered = data.filter((mem) =>
          format(parseISO(mem.created_at), 'yyyy-MM-dd') === selectedDateStr
        );

        setMemories(filtered);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, [date]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Memories for {format(date, 'PPP')}</h2>

      <div className="flex gap-2">
        <button onClick={() => setDate(subDays(date, 1))} className="btn">⬅️ Previous Day</button>
        <button onClick={() => setDate(addDays(date, 1))} className="btn">Next Day ➡️</button>
      </div>

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
          <p>No memories found for this day.</p>
        )}
      </ul>
    </div>
  );
}
