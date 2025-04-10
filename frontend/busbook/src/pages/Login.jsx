import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "operator") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-glass">
        <div className="auth-content">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to continue your journey</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
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
            <button type="submit" className="auth-button">Login</button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;