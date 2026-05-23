import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="modern-navbar">
      <div className="nav-logo">
        <Link to="/">
          <span className="logo-emoji">🌱</span>
          <span className="nav-logo-text">Jeel</span>
        </Link>
      </div>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="/search">Search</Link>
        {role === "center" && <Link to="/dashboard">My Center</Link>}
        {role === "admin" && <Link to="/dashboard">Admin</Link>}
        {role && <Link to="/profile">Profile</Link>}
        {!role ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
      
    </nav>
  );
}

export default Navbar;
