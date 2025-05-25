import React from 'react';
import './Navbar2.css';

export default function Navbar2() {
  return (
    <nav className="navbar2">
      <div className="nav-left">
        <img src="/logo.png" alt="Logo" className="nav-logo" />
        <div>
          <div className="nav-title">Masterverse<span className="nav-highlight">Acharya</span></div>
          <div className="nav-subtitle">Spiritual guidance and philosophical insights</div>
        </div>
      </div>
      <div className="nav-right">
        <button className="memory-button">Memory Sessions</button>
        <div className="user-profile">
          <img src="/avatar.jpg" alt="User" className="user-avatar" />
          <span className="username">Jagdish Pandya</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </nav>
  );
}
