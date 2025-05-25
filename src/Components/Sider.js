import React from 'react';
import './Sider.css'
import { FaHome, FaBolt, FaBell, FaCog } from 'react-icons/fa';

export default function Sider() {
  return (
    <div className="sider">
      <div className="sider-top">
        <div className="logo"><img src="/logo.png"></img></div>
        <div className="icon"><FaHome /></div>
        <div className="icon"><FaBolt /></div>
        <div className="icon"><FaBell /></div>
      </div>
      <div className="sider-bottom">
        <div className="icon"><FaCog /></div>
      </div>
    </div>
  );
}
