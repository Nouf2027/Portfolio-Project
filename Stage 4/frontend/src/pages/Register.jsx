import React, { useState } from 'react';
import API from '../api/axios';
import Loading from "../components/Loading";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [centerName, setCenterName] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [centerActivities, setCenterActivities] = useState('');
  const [centerTrade, setCenterTrade] = useState('');
  const [centerLicense, setCenterLicense] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must contain at least one special character");
      setLoading(false);
      return;
    }
    if (role === 'center' && (!centerName || !centerLocation || !centerActivities || !centerTrade)) {
      setError("Please fill all center information");
      setLoading(false);
      return;
    }
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (role === 'center') {
        await API.post('/centers', {
          name: centerName,
          location: centerLocation,
          description: centerActivities,
          license: centerLicense,
        }, { headers: { Authorization: `Bearer ${token}` } });
        alert("✅ Your center request has been submitted! Please wait for admin approval.");
        window.location.href = '/login';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Account Type</option>
          <option value="parent">Parent</option>
          <option value="center">Center</option>
        </select>

        {role === 'center' && (
          <>
            <hr style={{margin: '15px 0', borderColor: '#ffe082'}} />
            <h3 style={{color: '#3b5b7a', marginBottom: '10px'}}>🏫 Center Information</h3>
            <input type="text" placeholder="Center Name *" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
            <input type="text" placeholder="Location *" value={centerLocation} onChange={(e) => setCenterLocation(e.target.value)} required />
            <input type="text" placeholder="Activities (e.g. Programming, Art) *" value={centerActivities} onChange={(e) => setCenterActivities(e.target.value)} required />
            <input type="text" placeholder="Trade Number *" value={centerTrade} onChange={(e) => setCenterTrade(e.target.value)} required />
            <input type="text" placeholder="License Number" value={centerLicense} onChange={(e) => setCenterLicense(e.target.value)} />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
