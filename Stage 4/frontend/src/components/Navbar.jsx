import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🍀 Jeel</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/centers">Centers</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/my-center">My Center</Link>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;