import React, { useState, useEffect } from "react";
import API from "../api/axios";
import {
  FiUser, FiMail, FiHome, FiSearch, FiLogOut,
  FiCamera, FiBookOpen, FiCalendar, FiMapPin,
  FiShield, FiUsers, FiCheckCircle, FiX
} from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const role = user?.role;

  const [bookings, setBookings]           = useState([]);
  const [centerData, setCenterData]       = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);
  const [centerCourses, setCenterCourses] = useState([]);
  const [users, setUsers]                 = useState([]);
  const [centers, setCenters]             = useState([]);

  // رفع صورة  
  const [avatarFile, setAvatarFile]       = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [uploadMsg, setUploadMsg]         = useState("");

  useEffect(() => {
    if (role === "parent") {
      API.get("/bookings/me").then(res => setBookings(res.data)).catch(() => {});
    }
    if (role === "center") {
      API.get("/centers/mine").then(res => {
        setCenterData(res.data);
        if (res.data?.id) {
          API.get(`/centers/${res.data.id}/courses`).then(r => setCenterCourses(r.data)).catch(() => {});
        }
      }).catch(() => {});
      API.get("/bookings/center").then(res => setCenterBookings(res.data)).catch(() => {});
    }
    if (role === "admin") {
      API.get("/auth/users").then(res => setUsers(res.data)).catch(() => {});
      API.get("/centers/all").then(res => setCenters(res.data)).catch(() => {});
    }
  }, [role]);

  const handleCancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch {
      alert("فشل إلغاء الحجز.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      const form = new FormData();
      form.append("image", avatarFile);
      const res = await API.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      const updatedUser = { ...user, avatar: res.data.url };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setUploadMsg("تم رفع الصورة بنجاح ✓");
      setTimeout(() => setUploadMsg(""), 3000);
    } catch {
      // save locally if upload fails
      const updatedUser = { ...user, avatar: avatarPreview };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setUploadMsg("تم حفظ الصورة محلياً ✓");
      setTimeout(() => setUploadMsg(""), 3000);
    }
  };

  const statusLabel = (s) =>
    s === "pending" ? "قيد الانتظار" : s === "confirmed" ? "مؤكد" : "ملغي";

  return (
    <div className="pf-root" dir="rtl">

      {/*  Sidebar  */}
      <aside className="pf-sidebar">
        <div className="pf-sidebar-logo">
          <span className="pf-logo-icon">🌱</span>
          <span className="pf-logo-text">Jeel</span>
        </div>
        <nav className="pf-nav">
          <a href="/" className="pf-nav-item"><FiHome /><span>الرئيسية</span></a>
          <a href="/search" className="pf-nav-item"><FiSearch /><span>المراكز</span></a>
          {(role === "center" || role === "admin") && (
            <a href="/dashboard" className="pf-nav-item">
              <FiShield /><span>لوحة التحكم</span>
            </a>
          )}
          <a href="/profile" className="pf-nav-item active"><FiUser /><span>الملف الشخصي</span></a>
        </nav>
        <a
          href="/login"
          className="pf-nav-item pf-logout"
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); }}
        >
          <FiLogOut /><span>تسجيل الخروج</span>
        </a>
      </aside>

      {/*  Main  */}
      <main className="pf-main">

        {/* بطاقة الترحيب */}
        <div className="pf-hero-card">
          <div className="pf-hero-info">
            <h1>مرحباً، {user?.name}</h1>
            <p><FiMail style={{marginLeft:6}}/>{user?.email}</p>
            <span className="pf-role-badge">{role === "parent" ? "ولي أمر" : role === "center" ? "مركز" : "مدير"}</span>
          </div>
          {/* أيقونة المستخدم / صورة الملف الشخصي */}
          <div className="pf-avatar-wrap">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="pf-avatar-img" />
              : <div className="pf-avatar-placeholder"><FiUser /></div>
            }
            {role === "parent" && (
              <label className="pf-avatar-edit" title="تغيير الصورة">
                <FiCamera />
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange} />
              </label>
            )}
          </div>
        </div>

        {/* زر رفع + رسالة نجاح */}
        {role === "parent" && avatarFile && (
          <div className="pf-upload-bar">
            <span>{avatarFile.name}</span>
            <button className="pf-btn-orange" onClick={handleAvatarUpload}>رفع الصورة</button>
          </div>
        )}
        {uploadMsg && <div className="pf-success">{uploadMsg}</div>}

        {/*  ولي الأمر  */}
        {role === "parent" && (
          <div className="pf-section">
            <h2 className="pf-section-title"><FiBookOpen /> حجوزاتي</h2>
            {bookings.length === 0 ? (
              <div className="pf-empty">
                <p>لا توجد حجوزات بعد</p>
                <a href="/search" className="pf-btn-orange">استعرض المراكز</a>
              </div>
            ) : (
              <div className="pf-bookings-grid">
                {bookings.map((b) => (
                  <div key={b.id} className="pf-booking-card">
                    <div className="pf-booking-top">
                      <h3>{b.course_name}</h3>
                      <span className={`pf-badge ${b.status}`}>{statusLabel(b.status)}</span>
                    </div>
                    <p><FiHome style={{marginLeft:4}}/>{b.center_name}</p>
                    <p><FiCalendar style={{marginLeft:4}}/>{new Date(b.date).toLocaleDateString("ar-SA")}</p>
                    <button className="pf-btn-cancel" onClick={() => handleCancelBooking(b.id)}>
                      <FiX /> إلغاء الحجز
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/*  المركز  */}
        {role === "center" && (
          <>
            {centerBookings.length > 0 && (
              <div className="pf-alert-banner">
                🔔 لديك {centerBookings.length} حجز جديد
              </div>
            )}
            <div className="pf-grid-2">
              <div className="pf-card">
                <h2><FiHome /> بيانات المركز</h2>
                {centerData ? (
                  <>
                    <p><strong>الاسم:</strong> {centerData.name}</p>
                    <p><FiMapPin style={{marginLeft:4}}/>{centerData.location}</p>
                    <p>
                      <strong>الحالة:</strong>{" "}
                      <span style={{color: centerData.approved ? "#16a34a" : "#d97706"}}>
                        {centerData.approved ? "معتمد ✓" : "قيد المراجعة"}
                      </span>
                    </p>
                    <a href="/dashboard" className="pf-btn-orange" style={{marginTop:12,display:"inline-block"}}>
                      إدارة المركز
                    </a>
                  </>
                ) : (
                  <div className="pf-empty">
                    <a href="/dashboard" className="pf-btn-orange">تسجيل مركز</a>
                  </div>
                )}
              </div>

              <div className="pf-card">
                <h2><FiBookOpen /> دوراتي</h2>
                {centerCourses.length === 0
                  ? <p className="pf-muted">لا توجد دورات بعد</p>
                  : centerCourses.map(c => (
                    <div key={c.id} className="pf-course-row">
                      <span>{c.name}</span>
                      <span className="pf-price">{c.price} ريال</span>
                    </div>
                  ))
                }
              </div>

              <div className="pf-card pf-full-col">
                <h2><FiCalendar /> حجوزات المركز</h2>
                {centerBookings.length === 0
                  ? <p className="pf-muted">لا توجد حجوزات بعد</p>
                  : centerBookings.map(b => (
                    <div key={b.id} className="pf-booking-row">
                      <span>{b.course_name}</span>
                      <span>{b.email}</span>
                      <span className={`pf-badge ${b.status}`}>{statusLabel(b.status)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        )}

        {/*  الأدمن  */}
        {role === "admin" && (
          <div className="pf-admin-stats">
            <div className="pf-stat-card">
              <FiUsers className="pf-stat-icon" style={{color:"#f97316"}}/>
              <h1>{users.length}</h1>
              <p>إجمالي المستخدمين</p>
            </div>
            <div className="pf-stat-card">
              <FiHome className="pf-stat-icon" style={{color:"#3b82f6"}}/>
              <h1>{centers.length}</h1>
              <p>إجمالي المراكز</p>
            </div>
            <div className="pf-stat-card">
              <FiCheckCircle className="pf-stat-icon" style={{color:"#10b981"}}/>
              <h1>{centers.filter(c => c.approved).length}</h1>
              <p>مراكز معتمدة</p>
            </div>
            <div className="pf-stat-card" style={{borderTopColor:"#8b5cf6"}}>
              <FiShield className="pf-stat-icon" style={{color:"#8b5cf6"}}/>
              <h1>{centers.filter(c => !c.approved).length}</h1>
              <p>قيد المراجعة</p>
              <a href="/dashboard" className="pf-btn-orange" style={{marginTop:12,display:"inline-block",fontSize:13}}>
                لوحة الإدارة
              </a>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;