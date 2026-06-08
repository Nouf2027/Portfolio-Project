import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import CenterDetails from "./pages/CenterDetails";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import Dashboard from "./components/Dashboard";
import Profile from './pages/Profile';
import { useLocation } from "react-router-dom";
function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";
}

function App() {
  return (
    <BrowserRouter>
{!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/centers/:id" element={<CenterDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
