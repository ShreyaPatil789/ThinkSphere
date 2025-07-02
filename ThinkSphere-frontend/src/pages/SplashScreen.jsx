import { useEffect, useState } from "react";
import "./SplashScreen.css"; // For animations

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof onFinish === "function") {
        onFinish();
      }
    }, 2000);
  
    return () => clearTimeout(timeout);
  }, []);
  

  return (
    <div className="splash-container">
      <img src="/logo.png" alt="Logo" className="splash-logo" />
    </div>
  );
};

export default SplashScreen;
