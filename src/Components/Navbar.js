import React from 'react'
import './Navbar.css';
export default function Navbar(props) {
  return (
    <div>
<nav className="navbar bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand">{props.title}</a>
    <div id="signup">
      <button className="btn btn-outline-success" type="submit" id="log">Log In</button>
      <a href="" id="up">Sign Up For Free</a>
      </div>
  </div>
</nav></div>
  )
}
