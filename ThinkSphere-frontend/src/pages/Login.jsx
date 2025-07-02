import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // 🔹 New state for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
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
        </form>
      </div>
    </div>
    </div>
  );
}
