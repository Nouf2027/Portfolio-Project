import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
     <Link to="/" className="brand">
  <span className="logo-icon">🌱</span>
  <span className="logo-text">Jeel</span>
</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "parent" && <Link to="/profile">Profile</Link>}
            {user.role === "center" && <Link to="/my-center">My Center</Link>}
            {user.role === "admin" && <Link to="/dashboard">Dashboard</Link>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;