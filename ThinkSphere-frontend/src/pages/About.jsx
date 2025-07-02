import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <nav className="about-navbar">
        <div className="about-navbar-content">
          <img
            src="/logo.png"
            alt="ThinkSphere Logo"
            className="about-logo"
          />
          <div className="about-title">ThinkSphere</div>
          <div className="about-nav-links">
            <button  className="about-nav-button" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="about-nav-button" onClick={() => navigate("/Signup")} >
              Sign Up
            </button>
            <button className="about-nav-button" onClick={() => navigate("/Welcome")}>
              Home
            </button>
          </div>
        </div>
      </nav>

      <header className="about-header">
        <h1>ThinkSphere</h1>
        <h2>In a world of endless scrolls, we bring back thoughtful words.</h2>
        <p>
          ThinkSphere is more than just a blogging platform — it’s a digital space crafted for students to express, explore, and engage with ideas.
        </p>
      </header>

      <section className="about-image-section">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
          alt="Team Working"
        />
      </section>

      <section className="about-description">
        <p className="main-text">
          In an age where meaningful writing is fading into the background and attention spans are shrinking, we’re building a community that revives the joy of writing and the habit of reading.
        </p>
        <p className="sub-text">
          As the art of writing slowly fades in the noise of reels and rush,
          ThinkSphere stands still — inviting you to pen down your thoughts,
          share your stories, and read what others have lived.
        </p>
      </section>

      <header className="about-header quote-header">
        <h2>"Read. Write. Connect. ThinkSphere is your digital thinking space."</h2>
      </header>

      <section className="about-image-section">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"
          alt="Thinking Together"
        />
      </section>

      <section className="about-difference">
        <h2>What’s different when you work with us?</h2>
        <div className="difference-grid">
          <div>
            <p>
              When you join ThinkSphere, you're stepping into a growing digital space created by students, for students — a place where ideas thrive, voices are heard, and content matters.
            </p>
            <p>
              ThinkSphere isn't just another blogging platform — it's a creative movement built to revive the dying art of reading and writing among college students. We’re on a mission to help young minds share stories, opinions, and knowledge in a clean, thoughtful, and expressive way.
            </p>
          </div>
          <div>
            <p>We’re built on 3 core values:</p>
            <ul>
              <li>✍️ Authentic Expression: Every student has a voice worth sharing.</li>
              <li>⚡ Simple &amp; Seamless: From posting blogs to engaging with others — it's all smooth.</li>
              <li>🌍 Built for Community: ThinkSphere is more than tech. It’s a space to connect and grow.</li>
            </ul>
            <p>
              Whether you’re a reader, a writer, or someone just curious —
              ThinkSphere is your digital thinking space.
            </p>
          </div>
        </div>
      </section>

      <section className="about-image-section">
        <img
          src="/sample2.webp"
          alt="Creative Students"
        />
      </section>

      <section className="about-ending">
        <h2>Write freely. Read deeply. Think boldly.</h2>
        <p>
          At ThinkSphere, we believe every student has a story worth sharing. Whether it’s your first blog or your hundredth, this is your space to be heard.
        </p>
      </section>
    </div>
  );
};

export default About;