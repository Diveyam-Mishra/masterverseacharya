import React from 'react';
import './SpiritualAssistant.css';
import Navbar2 from './Navbar2';
import Sider from './Sider';
import Sidebar from './Sidebar';

export default function SpiritualAssistant() {
  return (
    <div className="spiritual-layout">
      <Sider />
      <Sidebar />
      <div className="main-content">
        <Navbar2 />
        <div className="chat-window">
          <div className="message user">Hello!</div>
          <div className="message assistant">Namaste, how may I help you?</div>
          <input type="text" className="input-bar" placeholder="Type your message..." />
        </div>
      </div>
    </div>
  );
}
