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
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
    }
  };

  return (
    <div className="jeel-login-page" dir="rtl">
      <div className="jeel-login-left">
        <div className="jeel-left-content">
          <h1>جيل</h1>
          <p>نساعد أولياء الأمور في إيجاد المركز المناسب لتنمية مهارات أطفالهم</p>
        </div>
      </div>

      <div className="jeel-login-right">
        <form className="jeel-login-form" onSubmit={handleSubmit}>
          <div className="jeel-logo">
            <img src="/jeel-logo.png" alt="شعار جيل" />
          </div>
          <h2>مرحباً بعودتك</h2>
          <p>يُرجى إدخال بياناتك لتسجيل الدخول</p>

          {error && <div className="login-error">{error}</div>}

          <label>البريد الإلكتروني</label>
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>كلمة المرور</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              <input type="checkbox" /> تذكرني
            </label>
            <a href="#" dir="rtl">نسيت كلمة المرور؟</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>

          <p className="login-register">
            ليس لديك حساب؟ <a href="/register" dir="rtl">إنشاء حساب</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;