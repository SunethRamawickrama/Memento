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
      setStatus('Memory saved!');
      setTitle('');
      setPerson('');
    } else {
      setStatus('Error saving memory.');
    }
  };

  return (
    <div className="form-container fourth-color">
      <h2>Create a New Memory</h2>
      <form onSubmit={handleSubmit} className="memory-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Person:
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="third-color">Save Memory</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
