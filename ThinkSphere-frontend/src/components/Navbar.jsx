import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>ThinkSphere</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
