import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Google sign-in failed: missing token");
      return;
    }

    const bootstrapAuth = async () => {
      try {
        localStorage.setItem("token", token);

        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("userId", res.data._id);

        navigate("/ModulePage", { replace: true });
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        setError("Google sign-in failed. Please try again.");
      }
    };

    bootstrapAuth();
  }, [navigate]);

  if (error) return <div style={{ padding: 24 }}>{error}</div>;

  return <div style={{ padding: 24 }}>Signing you in...</div>;
}
