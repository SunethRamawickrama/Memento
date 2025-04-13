'use client';
import Link from 'next/link';
import '../app/globals.css';
import { useState } from 'react';

export default function Dashboard() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-gray-800 px-4 py-8 relative items-center">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-cursive text-purple-600 mb-2">Memento</h1>
        <h2 className="text-xl font-semibold">Don't Let The Memories Fade!</h2>
      </header>

      {/* Main Centered Buttons */}
      <main className="flex-1 flex flex-col justify-center items-center gap-6 w-full">
        <Link href="/create-new-memory">
          <button className="w-64 py-3 bg-purple-500 hover:bg-purple-600 text-white text-lg font-medium rounded-xl shadow transition duration-200">
            ➕ New Memory
          </button>
        </Link>
        <Link href="/all-memories">
          <button className="w-64 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-medium rounded-xl shadow transition duration-200">
            👥 Memory Book
          </button>
        </Link>
        <Link href="#">
          <button className="w-64 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-xl shadow transition duration-200">
            📊 Progress Tracker
          </button>
        </Link>
      </main>

      {/* Footer Button - centered */}
      <footer className="w-full flex justify-center pb-4">
        <Link href="/relive">
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg transition duration-200">
            🎧 Relive a Memory
          </button>
        </Link>
      </footer>
    </div>
  );
}


// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import profilePic from '../../public/profile.jpg';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import '../app/globals.css';
// import { useState } from 'react';

// export default function Dashboard() {
//   const [date, setDate] = useState<Date | null>(new Date());

  

//   return (
//     <div className="dashboard-container fourth-color">
//       <div className="dashboard-header">
//         {/* <Image src={profilePic} alt="Profile" width={60} height={60} className="profile-pic" /> */}
//         <h2 className="username">Welcome back, User!</h2>
//       </div>

//       <div className="calendar-section">
//         <Calendar onChange={(val) => setDate(val as Date)} value={date} className="react-calendar" />
//         <h3 className="selected-date">Entries for {date?.toDateString()}</h3>
//         <div className="entry-box">No memories yet for this day.</div>
//       </div>

//       <div className="dashboard-footer">
    
//         <Link href="/create-new-memory">
//         <button className="third-color">➕ New Memory</button>
//         </Link>
//         <Link href="/all-memories"><button className="third-color">👥 Connections</button></Link>
//         <Link href="#"><button className="third-color">📊 Memory Tracker</button></Link>
//       </div>
//     </div>
//   );
// }