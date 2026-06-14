import React, { useState } from 'react';
import API from '../api/axios';
import Loading from "../components/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); setLoading(false); return; }
    if (!/[A-Z]/.test(password)) { setError("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل"); setLoading(false); return; }
    if (!/[0-9]/.test(password)) { setError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"); setLoading(false); return; }
    if (!/[!@#$%^&*]/.test(password)) { setError("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"); setLoading(false); return; }
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setLoading(false);
      setSuccess("تم إنشاء حسابك بنجاح.");
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={styles.page} dir="rtl">
      <div style={styles.left}>
        <img src="/children.jpg" alt="جيل" style={styles.bgImg} />
        <div style={styles.overlay} />
        <div style={styles.leftContent}>
          <img src="/sprout.png" alt="جيل" style={styles.leftLogo} />
          <h1 style={styles.leftTitle}>جيل</h1>
          <p style={styles.leftSub}>انضم إلى منصة جيل وابدأ رحلة اكتشاف أفضل المراكز التعليمية لطفلك</p>
        </div>
      </div>
      <div style={styles.right}>
        <form style={styles.formBox} onSubmit={handleSubmit}>
          <div style={styles.logoRow}>
            <img src="/sprout.png" alt="جيل" style={styles.formLogo} />
            <span style={styles.logoText}>جيل</span>
          </div>
          <h2 style={styles.title}>إنشاء حساب جديد</h2>
          <p style={styles.subtitle}>أنشئ حسابك وابدأ الاستكشاف</p>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>الاسم</label>
            <input type="text" placeholder="أدخل اسمك" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>البريد الإلكتروني</label>
            <input type="email" placeholder="أدخل بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>كلمة المرور</label>
            <div style={styles.passwordBox}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>نوع الحساب</label>
            <div style={{ position: "relative" }}>
              <select value={role} onChange={(e) => setRole(e.target.value)} required style={styles.select}>
                <option value="">اختر نوع الحساب</option>
                <option value="parent">ولي أمر</option>
                <option value="center">مركز</option>
              </select>
              <span style={styles.selectArrow}><FiChevronDown /></span>
            </div>
          </div>
          <button type="submit" style={styles.submitBtn}>تسجيل</button>
          <p style={styles.loginLink}>
            لديك حساب بالفعل؟{" "}
            <Link to="/login" style={styles.link}>تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "row-reverse", minHeight: "100vh", fontFamily: "'Cairo', 'Poppins', sans-serif" },
  left: { flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  bgImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" },
  overlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(27,58,107,0.88), rgba(86,194,230,0.7))" },
  leftContent: { position: "relative", textAlign: "center", padding: "0 40px", color: "#fff" },
  leftLogo: { width: 80, height: 80, objectFit: "contain", marginBottom: 16, filter: "brightness(0) invert(1)" },
  leftTitle: { fontSize: 52, fontWeight: 900, color: "#fff", marginBottom: 16 },
  leftSub: { fontSize: 18, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, maxWidth: 340, margin: "0 auto" },
  right: { width: "48%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "40px 24px", overflowY: "auto" },
  formBox: { width: "100%", maxWidth: 420 },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 },
  formLogo: { width: 48, height: 48, objectFit: "contain" },
  logoText: { fontSize: 26, fontWeight: 900, color: "#1B3A6B", fontFamily: "'Cairo', 'Poppins', sans-serif" },
  title: { fontSize: 26, fontWeight: 800, color: "#1B3A6B", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 15, color: "#64748b", marginBottom: 24, textAlign: "center" },
  error: { background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14, textAlign: "center" },
  successMsg: { background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600, textAlign: "center" },
  fieldGroup: { marginBottom: 18 },
  label: { display: "block", fontSize: 14, fontWeight: 700, color: "#1B3A6B", marginBottom: 7 },
  input: { width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f0f7ff", fontSize: 15, color: "#1e293b", outline: "none", fontFamily: "'Cairo', 'Poppins', sans-serif", boxSizing: "border-box" },
  passwordBox: { position: "relative" },
  eyeBtn: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 16, padding: 0 },
  select: { width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f0f7ff", fontSize: 15, color: "#1e293b", outline: "none", fontFamily: "'Cairo', 'Poppins', sans-serif", appearance: "none", boxSizing: "border-box" },
  selectArrow: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" },
  submitBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #ff7a00, #e85d04)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo', 'Poppins', sans-serif", marginBottom: 18, marginTop: 8, transition: "opacity 0.2s" },
  loginLink: { textAlign: "center", fontSize: 14, color: "#64748b" },
  link: { color: "#56C2E6", fontWeight: 700, textDecoration: "none" },
};

export default Register;
