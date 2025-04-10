import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-glass">
        <div className="auth-content">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to start your journey</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input 
                name="name" 
                type="text" 
                placeholder="Full Name" 
                onChange={handleChange} 
                required 
                className="auth-input"
              />
            </div>
            
            <div className="form-group">
              <input 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
                className="auth-input"
              />
            </div>
            
            <div className="form-group">
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
                className="auth-input"
              />
            </div>
            
            <div className="form-group">
              <label className="role-label">I want to register as:</label>
              <select 
                name="role" 
                onChange={handleChange} 
                value={formData.role}
                className="auth-select"
              >
                <option value="user">Regular User</option>
                <option value="operator">Bus Operator</option>
              </select>
            </div>
            
            <button type="submit" className="auth-button">Register Now</button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;