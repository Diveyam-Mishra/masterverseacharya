import React from 'react';
import './ChatListPanel.css';

export default function Sidebar() {
  return (
    <div className="chatlist-panel">
      <h2>Chats</h2>
      <input type="text" placeholder="Search..." />
      <div>
        <h4>Today</h4>
        <p>How to be a better person?</p>
        <p>Hacking FBI server with linux</p>
        <p>REACT NEXTJS Tutorial</p>

        <h4>Previous 7 Days</h4>
        <p>Fix SSL/TLS Error</p>
        <p>Mobile app prototypes</p>
        <p>Platform template for developers</p>
      </div>
    </div>
  );
}
