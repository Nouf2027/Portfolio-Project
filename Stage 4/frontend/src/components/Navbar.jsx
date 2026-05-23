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
        <Link to="/">☘️ Jeel</Link>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <Link to="/home">Home</Link>

        <Link to="/centers">Centers</Link>

        <Link to="/profile">Profile</Link>

        {role === "center" && (
          <Link to="/dashboard">My Center</Link>
        )}

        {role === "admin" && (
          <Link to="/dashboard">Admin</Link>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      <div
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

    </nav>
  );
}

export default Navbar;