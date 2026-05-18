import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
   <Link to="/" className="logo">
  <span className="logo-leaf">☘️</span>
  <h2 className="logo-text">Jeel</h2>
  <span className="logo-leaf">☘️</span>
</Link>
      <div className="nav-links">
        <Link to="/search">🔍 Search</Link>
      {role && (
  <NavLink
    to="/profile"
    className={({ isActive }) =>
      isActive ? "nav-link active-link" : "nav-link"
    }
  >
    🌼 Profile
  </NavLink>
)}
        {(role === 'admin' || role === 'center') && (
          <Link to="/dashboard">📊 Dashboard</Link>
        )}
        {!role ? (
          <>
            <Link to="/login">🔑 Login</Link>
            <Link to="/register">✨ Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{marginTop: '0'}}>
            🚪 Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
