import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (step === "email") return Boolean(email);
    if (step === "otp") return Boolean(email) && Boolean(otp);
    if (step === "reset") {
      return (
        Boolean(email) &&
        Boolean(resetToken) &&
        Boolean(newPassword) &&
        newPassword === confirmPassword
      );
    }
    return false;
  }, [step, email, otp, resetToken, newPassword, confirmPassword]);

  const requestOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/request-otp`, {
        email,
      });
      setMessage("If your account exists, an OTP has been sent to your email.");
      setStep("otp");
    } catch (e) {
      setError("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
        email,
        otp,
      });
      setResetToken(res.data.resetToken);
      setMessage("OTP verified. You can now set a new password.");
      setStep("reset");
    } catch (e) {
      const msg = e?.response?.data?.error || "Invalid OTP. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
        email,
        resetToken,
        newPassword,
      });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (e) {
      const msg = e?.response?.data?.error || "Unable to reset password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    if (step === "email") return requestOtp();
    if (step === "otp") return verifyOtp();
    if (step === "reset") return resetPassword();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: 420, background: "white", borderRadius: 14, padding: 24, boxShadow: "0px 10px 30px rgba(0,0,0,0.12)" }}>
        <h2 style={{ marginBottom: 8, color: "#222" }}>Forgot Password</h2>
        <p style={{ marginBottom: 16, color: "#666", fontSize: 13 }}>
          {step === "email" && "Enter your email and we’ll send you a one-time code."}
          {step === "otp" && "Enter the OTP sent to your email."}
          {step === "reset" && "Set a new password for your account."}
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            />

            {step !== "email" && (
              <input
                type="text"
                placeholder="OTP (6 digits)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
              />
            )}

            {step === "reset" && (
              <>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
                />
              </>
            )}

            {message && <div style={{ color: "#0f766e", fontSize: 13 }}>{message}</div>}
            {error && <div style={{ color: "#b91c1c", fontSize: 13 }}>{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#006466",
                color: "white",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: !canSubmit || loading ? 0.7 : 1,
              }}
            >
              {step === "email" && (loading ? "Sending OTP..." : "Send OTP")}
              {step === "otp" && (loading ? "Verifying..." : "Verify OTP")}
              {step === "reset" && (loading ? "Updating..." : "Reset Password")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "white",
                color: "#222",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
