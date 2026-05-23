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
      {!user ? (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </>
) : (
  <>
    <Link to="/">Home</Link>
    <Link to="/search">Search</Link>

    {user.role === "parent" && <Link to="/profile">Profile</Link>}
    {user.role === "center" && <Link to="/my-center">My Center</Link>}
    {user.role === "admin" && <Link to="/dashboard">Dashboard</Link>}

    <button onClick={handleLogout}>Logout</button>
  </>
)}
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
