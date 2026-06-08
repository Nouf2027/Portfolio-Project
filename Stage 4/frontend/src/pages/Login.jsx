import React, { useState } from 'react';
import API from '../api/axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
  <div className="jeel-login-page">
    <div className="jeel-login-left">
      <div className="jeel-left-content">
        <h1>Jeel</h1>
        <p>Helping parents find
the right center for
their children's growth</p>
      </div>
    </div>

    <div className="jeel-login-right">
      <form className="jeel-login-form" onSubmit={handleSubmit}>
<div className="jeel-logo">
  <img src="/jeel-logo.png" alt="Jeel Logo" />
</div>
        <h2>Welcome to Jeel 👋</h2>
<p>Please sign in to continue</p>

        {error && <div className="login-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="login-register">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  </div>
);

}

export default Login;
