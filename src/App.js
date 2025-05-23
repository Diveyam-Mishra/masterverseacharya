import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Religion from './Components/Religion';
import Navbar from './Components/Navbar';
import './App.css';

function App() {
  return (
    <>
      <Navbar title={<img src="Logo SVG 2.png" alt="Logo"  />} />

      {/* ✨ Hero Section */}
      <div className="hero-section">
        <h1 className="hero-welcome">Welcome to</h1>
        <h1 className="hero-title">Mastervers <span>Acharya ✨</span></h1>
        <p className="hero-subtitle">
          Begin your journey of spiritual growth and philosophical discovery. Explore <br />
          ancient wisdom, compare different traditions, and find guidance for your path.
        </p>
      </div>

      <Religion />

      <footer id="foot">
        <div><img src="/clip.png"></img></div>
      </footer>
    </>
  );
}

export default App;
