'use client';
import Image from 'next/image';
import Link from 'next/link';
import profilePic from '../../public/profile.jpg';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../src/app/globals.css';
import { useState } from 'react';

export default function Dashboard() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <div className="dashboard-container fourth-color">
      <div className="dashboard-header">
        {/* <Image src={profilePic} alt="Profile" width={60} height={60} className="profile-pic" /> */}
        <h2 className="username">Welcome back, User!</h2>
      </div>

      <div className="calendar-section">
        <Calendar onChange={(val) => setDate(val as Date)} value={date} className="react-calendar" />
        <h3 className="selected-date">Entries for {date?.toDateString()}</h3>
        <div className="entry-box">No memories yet for this day.</div>
      </div>

      <div className="dashboard-footer">
        <Link href="#"><button className="third-color">➕ New Conversation</button></Link>
        <Link href="#"><button className="third-color">👥 Connections</button></Link>
        <Link href="#"><button className="third-color">📊 Memory Tracker</button></Link>
      </div>
    </div>
  );
}