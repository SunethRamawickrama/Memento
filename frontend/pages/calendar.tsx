'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../src/app/globals.css';
import { motion } from 'framer-motion';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const today = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [viewingDay, setViewingDay] = useState(false);

  const journalEntries = [
    { id: 1, name: 'Alice', content: 'Went on a walk today.' },
    { id: 2, name: 'Bob', content: 'Had a lovely chat with Alice.' },
  ];

  return (
    <div className="memory-container fourth-color">
      {!viewingDay ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="month-view">
          <h2 className="month-title">{months[currentMonthIndex]} Memory Book</h2>
          <div className="book-grid">
            <motion.div whileHover={{ scale: 1.05 }} className="memory-book" onClick={() => setViewingDay(true)}>
              📘 {months[currentMonthIndex]}
            </motion.div>
          </div>
          <button onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))} className="third-color back-button">⬅ Previous Month</button>
        </motion.div>
      ) : (
        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="day-view">
          <h3>{today.toDateString()}</h3>
          {journalEntries.map(entry => (
            <div key={entry.id} className="entry-box">
              <strong>{entry.name}</strong>
              <p>{entry.content}</p>
            </div>
          ))}
          <button onClick={() => setViewingDay(false)} className="third-color back-button">⬅ Back to Month</button>
        </motion.div>
      )}
    </div>
  );
}