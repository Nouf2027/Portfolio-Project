import React, { useState } from 'react';
import API from '../api/axios';
import Loading from "../components/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [centerName, setCenterName] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [centerActivities, setCenterActivities] = useState('');
  const [centerTrade, setCenterTrade] = useState('');
  const [centerLicense, setCenterLicense] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        }, 
        
        { headers: { Authorization: `Bearer ${token}` } });
        setLoading(false);
        setSuccess("✅ تم إرسال طلب المركز بنجاح! سيتم مراجعته من قبل الإدارة.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        window.location.href = '/';
      }
setSuccessMessage(

      role === "center"

        ? "تم تسجيلك بنجاح. سيتم مراجعة مركزك من قبل الإدارة قبل ظهوره في الموقع."

        : "تم إنشاء حسابك بنجاح."

    );

{successMessage && (
  <div className="modal-overlay">
    <div className="edit-profile-modal">
      <h2>تم التسجيل بنجاح ✅</h2>
      <p>{successMessage}</p>

      <button
        className="main-btn"
        onClick={() => window.location.href = "/login"}
      >
        الذهاب لتسجيل الدخول
      </button>
    </div>
  </div>
)}

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
        {success && (
          <div style={{background:'#e8f5e9', color:'#2e7d32', padding:'14px 20px', borderRadius:'12px', marginBottom:'16px', border:'2px solid #a5d6a7', fontSize:'16px', fontWeight:'600'}}>
            {success}
          </div>
        )}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
         <label className="upload-label">
  Center Logo / Center Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>

<small>
  Upload a clear image for your center (JPG, PNG, WEBP)
</small>

          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
