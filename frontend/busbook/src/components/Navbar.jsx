import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "../styles/navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const role = storedUser ? JSON.parse(storedUser).role : null;

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(`/buses/all?search=${query}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectBus = (busId) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/booking/${busId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="glass-navbar">
      <div className="nav-container">
      <Link to="/" className="nav-logo">
  <img 
    src="/logo.jpg" 
    alt="BusBooking Logo" 
    className="logo-image"
  />
  <span className="logo-text">BusBooking</span>
</Link>

        
        

        <div className="nav-links">
          {/* Main Navigation Links */}
          <Link to="/" className="nav-link">Home</Link>
          {token && role === "user" && (
            <Link to="/user-dashboard" className="nav-link">Buses</Link>
          )}
          
          <Link to="/about" className="nav-link">About</Link>
          {/* Role-Based Links */}
          {token && role === "user" && (
            <Link to="/bookings" className="nav-link">My Bookings</Link>
          )}
          {token && role === "operator" && (
            <Link to="/admindashboard" className="nav-link">Dashboard</Link>
          )}

          {/* Login/Logout */}
          {token ? (
            <button onClick={handleLogout} className="nav-button">Logout</button>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
