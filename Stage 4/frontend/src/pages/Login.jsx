import React, { useState } from 'react';
import API from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <p>A smart platform for discovering child development centers</p>
      </div>
    </div>

    <div className="jeel-login-right">
      <form className="jeel-login-form" onSubmit={handleSubmit}>
        <h2>Welcome back 👋</h2>
        <p>Please enter your details to login to your account</p>

        {error && <div className="login-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
