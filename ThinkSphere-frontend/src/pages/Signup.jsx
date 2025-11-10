import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css"; // Import CSS file
import { API_BASE_URL } from "../config";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      console.log("Signup Success:", res.data);
      navigate("/login"); // Redirect to login after success
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
      console.error("Signup Error:", error.response?.data);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section - Welcome Text */}
      <div className="left-section">
        <h1>Join Us Today!</h1>
        <p>
          Create an account and start sharing your thoughts with the world.
          Connect, learn, and grow with the community.
        </p>
      </div>

      {/* Right Section - Signup Form */}
      <div className="right-section">
        <h2>Sign Up</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSignup}>
          {/* Username Input */}
          <div className="input-container">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="input-container">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-container">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Signup Button */}
          <button className="signup-btn" type="submit">Signup</button>
        </form>

        {/* Already have an account? */}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

