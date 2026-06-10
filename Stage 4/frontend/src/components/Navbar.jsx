import React from 'react';
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaShieldAlt, FaBuilding, FaUser, FaKey, FaStar, FaSignOutAlt } from 'react-icons/fa';

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
      <div className="logo">
        <h2 className="logo-text">جيل</h2>
      </div>
      <div className="nav-links">
        <Link to="/"><FaHome /> الرئيسية</Link>
        <Link to="/search"><FaSearch /> البحث</Link>
        {role && (
          <Link to="/dashboard">
            {role === 'admin'
              ? <><FaShieldAlt /> لوحة التحكم</>
              : role === 'center'
              ? <><FaBuilding /> بوابة المركز</>
              : <><FaUser /> حسابي</>}
          </Link>
        )}
        {!role ? (
          <>
            <Link to="/login"><FaKey /> تسجيل الدخول</Link>
            <Link to="/register"><FaStar /> إنشاء حساب</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ marginTop: '0' }}>
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
