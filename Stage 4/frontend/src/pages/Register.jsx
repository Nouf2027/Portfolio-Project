import React, { useState } from 'react';
import API from '../api/axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registration successful');
      window.location.href = '/';
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Account Type</option>
          <option value="parent">Parent</option>
          <option value="center">Center</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
