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
const [image, setImage] = useState("");
const [location, setLocation] = useState("");
const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) {
  alert("Password must be at least 8 characters");
  return;
}

if (!/[A-Z]/.test(password)) {
  alert("Password must contain at least one uppercase letter");
  return;
}

if (!/[0-9]/.test(password)) {
  alert("Password must contain at least one number");
  return;
}

if (!/[!@#$%^&*]/.test(password)) {
  alert("Password must contain at least one special character");
  return;
}
await API.post("/centers", {
  name,
  location,
  description,
  image,
});

    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
      window.location.href = '/';
    } catch (err) {
      setLoading(false);
      console.log(err);

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
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
  type="text"
  placeholder="Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
/>

<textarea
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
  type="text"
  placeholder="Center Image URL"
  value={image}
  onChange={(e) => setImage(e.target.value)}
/>
        <input
          
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  minLength={8}
  required
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
