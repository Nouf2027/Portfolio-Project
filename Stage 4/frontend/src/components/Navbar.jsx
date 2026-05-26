import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="modern-navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-emoji">🌱</span>
        <span className="nav-logo-text">Jeel</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>

        {role === "parent" && <Link to="/profile">Profile</Link>}
        {role === "center" && <Link to="/my-center">My Center</Link>}
        {role === "admin" && <Link to="/dashboard">Admin</Link>}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;