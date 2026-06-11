import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }

    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <nav className="navbar">
     <Link to="/" className="brand">
    {/*<span className="logo-icon">🌱</span>*/}
  <span className="logo-text">جيل</span>
</Link>

      <div className="nav-links">
        <Link to="/">الصفحة الرئسية</Link>

        {!user ? (
          <>
            <Link to="/login">تسجيل الدخول</Link>
            <Link to="/register" >
              التسجيل
            </Link>
          </>
        ) : (
          <>
            {user.role === "parent" && <Link to="/profile">حسابي</Link>}
            {user.role === "center" && <Link to="/my-center">مركزي</Link>}
            {user.role === "admin" && <Link to="/dashboard">لوحة التحكم</Link>}
            <button className="logout-btn" onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
