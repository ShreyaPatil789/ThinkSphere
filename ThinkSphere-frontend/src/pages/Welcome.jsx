import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Navbar */}
      <nav className="navbar">
        <img src="/logo.png" alt="ThinkSphere Logo" className="logo" /> {/* Logo Image */}
        <div className="title">ThinkSphere</div>
        <div className="nav-links">
          <button onClick={() => navigate("/login")} className="nav-button">
            Sign In
          </button>
          <button onClick={() => navigate("/Signup")} className="nav-button">
            Sign Up
          </button>
          <button onClick={() => navigate("/About")} className="nav-button">
            About Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="welcome-content">
        <h1>Explore..Express..Expand..! </h1>
        <div className="desc"><p>Welcome To ThinkSphere !!! Share your thoughts, experiences, and knowledge with the world & connect with like minded People </p></div>
        <button className="btn" onClick={() => navigate("/Signup")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
