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
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('تم انشاء الحساب بنجاح');
      window.location.href = '/';
    } catch (err) {
      setError('فشل انشاء الحساب، يرجى المحاولة مره اخرى');
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="البريد الالكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">اختر نوع الحساب</option>
          <option value="parent">ولي امر</option>
          <option value="center">مركز</option>
        </select>
        <button type="submit">انشاء الحساب</button>
      </form>
    </div>
  );
}

export default Register;
