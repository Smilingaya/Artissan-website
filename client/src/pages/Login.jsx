// LoginPage.jsx
import React, { useState } from "react";
import "./Login.css";
import artisan2 from '../assets/artisan2.jpg';
import googleIcon from '../assets/google.png';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.email || result.password || "Something went wrong");
      } else {
        setSuccess("Success! Redirecting...");
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={artisan2} alt="Artisan2" className="auth-image" />  
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit}>
          <p className="register-link">
            Not a member? <a href="/register">Register now</a>
          </p>

          <h2>Hello Again!</h2>
          <p>Welcome back you’ve been missed!</p>

          <input type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Sign In</button>

          <p className="password-link">Recovery Password</p>
          <div className="social-login">
            <span>Or continue with</span>
            <div className="social-icons">
              <img src={googleIcon} alt="Google" className="social-icon" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;