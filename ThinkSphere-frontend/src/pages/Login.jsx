import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // 🔹 New state for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
  
      // Store token and user data in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);
      console.log("Login successful, token & user stored:", res.data.user);
  
      // Clear any previous error message
      setErrorMsg("");
  
      // Redirect to the next page
      navigate("/ModulePage");
  
    } catch (error) {
      console.error("Login failed", error);
  
      // Ensure the error response has a structure
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error); // Show specific error message
      } else {
        setErrorMsg("Something went wrong. Please try later.");
      }
    }
  };
  

  return (
    <div className="wrapper">
    <div className="login-container">
      <div className="left-section">
        <h1>Welcome to ThinkSphere</h1>
        <p>Ready to share your thoughts,  experiences, and ideas with a community of like-minded Peers?</p>
      </div>

      <div className="right-section">
        <h2>User Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <i className="fas fa-user"></i>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password" // ✅ Avoid warning
            />
          </div>

          {/* 🔴 Show error message here */}
          {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button className="login-btn" type="submit">Login</button>
          <div className="oauth-divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="google-btn"
            onClick={() =>
              (window.location.href = `${API_BASE_URL}/api/auth/google`)
            }
          >
            <span className="google-btn__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.23 3.6l6.9-6.9C35.9 2.38 30.42 0 24 0 14.62 0 6.56 5.38 2.56 13.22l8.02 6.22C12.5 13.02 17.78 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.14 24.55c0-1.64-.15-3.22-.43-4.75H24v9h12.4c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.56C43.44 37.14 46.14 31.3 46.14 24.55z"/>
                <path fill="#FBBC05" d="M10.58 28.22c-.5-1.5-.78-3.1-.78-4.72s.28-3.22.78-4.72l-8.02-6.22C.92 15.94 0 19.86 0 23.5s.92 7.56 2.56 10.94l8.02-6.22z"/>
                <path fill="#34A853" d="M24 48c6.42 0 11.82-2.12 15.76-5.76l-7.18-5.56c-2 1.35-4.56 2.14-8.58 2.14-6.22 0-11.5-3.52-13.42-8.44l-8.02 6.22C6.56 42.62 14.62 48 24 48z"/>
              </svg>
            </span>
            <span className="google-btn__text">Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
