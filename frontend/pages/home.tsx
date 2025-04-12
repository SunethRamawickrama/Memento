'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.png';
import './../src/app/globals.css';

export default function Home() {
  return (
    <div className="container first-color">
      <h1>My App Title</h1>
      {/* <Image src={logo} alt="App Logo" width={200} height={200} style={{ margin: '20px 0' }} /> */}
      <div>
        <Link href="/login"><button className="third-color">Login</button></Link>
        <Link href="/signup"><button className="fourth-color">Signup</button></Link>
      </div>
    </div>
  );
}