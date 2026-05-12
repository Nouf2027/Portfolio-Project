import React from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-emoji">🌱</span>
        <h2 className="logo-text">Jeel</h2>
        <span className="logo-emoji">🌱</span>
      </div>
      <div className="nav-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/search">🔍 Search</Link>
        <Link to="/login">🔑 Login</Link>
        <Link to="/register">✨ Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
