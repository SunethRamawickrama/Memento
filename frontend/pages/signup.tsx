'use client';
export default function Signup() {
  return (
    <div className="container fourth-color">
      <h2>Signup</h2>
      <form>
        <input type="text" placeholder="First Name" required /><br />
        <input type="text" placeholder="Last Name" required /><br />
        <input type="text" placeholder="Username" required /><br />
        <input type="password" placeholder="Password" required /><br />
        <button type="submit" className="third-color">Signup</button>
      </form>
    </div>
  );
}