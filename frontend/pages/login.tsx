'use client';
export default function Login() {
  return (
    <div className="container second-color">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Username" required /><br />
        <input type="password" placeholder="Password" required /><br />
        <button type="submit" className="third-color">Login</button>
      </form>
    </div>
  );
}
