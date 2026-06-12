import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiCalendar, FiUsers, FiCheckCircle,
  FiEdit2, FiTrash2, FiX, FiPlus, FiChevronLeft,
  FiChevronRight, FiHome, FiUser, FiSettings,
  FiMenu, FiLogOut, FiShield
} from "react-icons/fi";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];
const DAYS_AR = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

// لون لكل مجال
const TYPE_COLORS = {
  "برمجة": "#3b82f6",
  "فن": "#ec4899",
  "رياضة": "#10b981",
  "موسيقى": "#8b5cf6",
  "لغات": "#f59e0b",
  "علوم": "#06b6d4",
  "رياضيات": "#ef4444",
  "طبخ": "#f97316",
  "روبوتيك": "#6366f1",
  "أخرى": "#64748b",
};
const getTypeColor = (type) => TYPE_COLORS[type] || "#f97316";

function MiniCalendar({ courses }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => { setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }); setSelectedDay(null); };
  const next = () => { setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }); setSelectedDay(null); };

  const getCoursesForDay = (day) => {
    if (!day || !courses) return [];
    return courses.filter(course => {
      if (!course.days) return false;
      const courseDate = new Date(course.days);
      return (
        courseDate.getDate() === day &&
        courseDate.getMonth() === current.month &&
        courseDate.getFullYear() === current.year
      );
    });
  };

  const selectedCourses = selectedDay ? getCoursesForDay(selectedDay) : [];

  return (
    <div className="cd-calendar">
      <div className="cd-cal-header">
        <button onClick={prev}><FiChevronRight /></button>
        <span>{MONTHS_AR[current.month]} {current.year}</span>
        <button onClick={next}><FiChevronLeft /></button>
      </div>
      <div className="cd-cal-days-header">
        {DAYS_AR.map(d => <span key={d}>{d.slice(0,2)}</span>)}
      </div>
      <div className="cd-cal-grid">
        {cells.map((day, i) => {
          const dayCourses = getCoursesForDay(day);
          const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();
          const isSelected = day === selectedDay;
          const hasCourse = dayCourses.length > 0;
          const courseColor = hasCourse ? getTypeColor(dayCourses[0].description) : null;
          return (
            <div
              key={i}
              className={"cd-cal-cell" + (isToday ? " today" : "") + (!day ? " empty" : "") + (hasCourse ? " has-course" : "") + (isSelected ? " selected" : "")}
              style={hasCourse && !isToday ? { background: courseColor + "22", borderRadius: "8px" } : {}}
              onClick={() => day && setSelectedDay(isSelected ? null : day)}
            >
              {day && <span className="cd-day-num">{day}</span>}
              {hasCourse && (
                <div className="cd-cal-dots">
                  {dayCourses.slice(0,3).map((c, idx) => (
                    <span key={idx} className="cd-cal-dot" style={{ background: getTypeColor(c.description) }}></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDay && selectedCourses.length > 0 && (
        <div className="cd-cal-popup">
          <div className="cd-cal-popup-header">
            <strong>{selectedDay} {MONTHS_AR[current.month]}</strong>
            <button onClick={() => setSelectedDay(null)}><FiX /></button>
          </div>
          {selectedCourses.map(course => (
            <div key={course.id} className="cd-cal-course-item">
              <div className="cd-cal-course-icon" style={{ background: getTypeColor(course.description) + "22", color: getTypeColor(course.description) }}><FiBookOpen /></div>
              <div>
                <strong>{course.name}</strong>
                <span>{course.times || "الوقت غير محدد"} · {course.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedDay && selectedCourses.length === 0 && (
        <p className="cd-cal-empty">لا توجد دورات في هذا اليوم</p>
      )}
    </div>
  );
}


function SettingsSection({ center }) {
  const [settingName, setSettingName] = useState(center?.name || "");
  const [settingEmail, setSettingEmail] = useState("");
  const [settingPhone, setSettingPhone] = useState("");
  const [settingCity, setSettingCity] = useState(center?.location || "");
  const [settingDesc, setSettingDesc] = useState(center?.description || "");
  const [settingLogo, setSettingLogo] = useState(null);
  const [settingSuccess, setSettingSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const cities = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","تبوك","أبها","القصيم","حائل","نجران","جازان","الطائف"];

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", settingName);
      formData.append("location", settingCity);
      formData.append("description", settingDesc);
      if (settingLogo) formData.append("image", settingLogo);
      await API.patch(`/centers/${center.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSettingSuccess("تم حفظ التغييرات بنجاح.");
      setTimeout(() => setSettingSuccess(""), 3000);
    } catch { alert("فشل حفظ التغييرات."); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert("كلمة المرور الجديدة غير متطابقة."); return; }
    try {
      await API.patch("/users/password", { oldPassword, newPassword });
      setSettingSuccess("تم تغيير كلمة المرور بنجاح.");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setSettingSuccess(""), 3000);
    } catch { alert("فشل تغيير كلمة المرور."); }
  };

  return (
    <div className="cd-section">
      <div className="cd-page-header">
        <div><h1>الإعدادات</h1><p>إدارة إعدادات مركزك</p></div>
      </div>

      {settingSuccess && <div className="cd-success">{settingSuccess}</div>}

      {/* بيانات المركز */}
      <div className="cd-card cd-settings-card">
        <form onSubmit={handleSaveSettings}>
          <div className="cd-settings-grid">
            <div className="cd-settings-fields">
              <div className="cd-settings-row">
                <div className="cd-settings-field">
                  <label>اسم المركز</label>
                  <input className="cd-input" value={settingName} onChange={e => setSettingName(e.target.value)} />
                </div>
                <div className="cd-settings-field">
                  <label>البريد الإلكتروني</label>
                  <input className="cd-input" type="email" value={settingEmail} onChange={e => setSettingEmail(e.target.value)} placeholder="info@example.com" />
                </div>
              </div>
              <div className="cd-settings-row">
                <div className="cd-settings-field">
                  <label>رقم التواصل</label>
                  <input className="cd-input" value={settingPhone} onChange={e => setSettingPhone(e.target.value)} placeholder="+966 50 000 0000" />
                </div>
                <div className="cd-settings-field">
                  <label>المدينة</label>
                  <select className="cd-input cd-select" value={settingCity} onChange={e => setSettingCity(e.target.value)}>
                    <option value="">اختر المدينة</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="cd-settings-field" style={{gridColumn:"1/-1"}}>
                <label>وصف المركز</label>
                <textarea className="cd-input cd-textarea" value={settingDesc} onChange={e => setSettingDesc(e.target.value)} rows={3} />
              </div>
            </div>

            {/* شعار المركز */}
            <div className="cd-settings-logo">
              <label>شعار المركز</label>
              <div className="cd-logo-box">
                {settingLogo
                  ? <img src={URL.createObjectURL(settingLogo)} alt="logo" className="cd-logo-preview" />
                  : <div className="cd-logo-placeholder">{center?.name?.[0]}</div>
                }
              </div>
              <label className="cd-logo-btn">
                تغيير الشعار
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e => setSettingLogo(e.target.files[0])} />
              </label>
              <span className="cd-logo-hint">JPG, PNG حتى 2MB</span>
            </div>
          </div>

          <button type="submit" className="cd-btn-save">حفظ التغييرات</button>
        </form>
      </div>

      {/* تغيير كلمة المرور */}
      <div className="cd-card cd-settings-item" onClick={() => setShowPasswordForm(!showPasswordForm)}>
        <div className="cd-settings-item-right">
          <div className="cd-settings-item-icon" style={{background:"#fef9c3"}}>
            <FiSettings style={{color:"#a16207"}} />
          </div>
          <div>
            <strong>تغيير كلمة المرور</strong>
            <span>تحديث كلمة مرور حسابك</span>
          </div>
        </div>
        <FiChevronLeft className={`cd-settings-arrow ${showPasswordForm ? "open" : ""}`} />
      </div>
      {showPasswordForm && (
        <div className="cd-card cd-settings-sub">
          <form onSubmit={handleChangePassword} className="cd-form">
            <input className="cd-input" type="password" placeholder="كلمة المرور الحالية *" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            <input className="cd-input" type="password" placeholder="كلمة المرور الجديدة *" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <input className="cd-input" type="password" placeholder="تأكيد كلمة المرور الجديدة *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <div className="cd-form-actions">
              <button type="submit" className="cd-btn-primary">تغيير كلمة المرور</button>
              <button type="button" className="cd-btn-secondary" onClick={() => setShowPasswordForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* الترخيص */}
      <div className="cd-card cd-settings-item" onClick={() => setShowLicenseForm(!showLicenseForm)}>
        <div className="cd-settings-item-right">
          <div className="cd-settings-item-icon" style={{background:"#e0f2fe"}}>
            <FiBookOpen style={{color:"#0369a1"}} />
          </div>
          <div>
            <strong>الترخيص</strong>
            <span>إدارة ترخيص وموافقات المركز</span>
          </div>
        </div>
        <FiChevronLeft className={`cd-settings-arrow ${showLicenseForm ? "open" : ""}`} />
      </div>
      {showLicenseForm && (
        <div className="cd-card cd-settings-sub">
          <label className="cd-file-label">
            رفع ملف الترخيص (PDF أو صورة)
            <input type="file" accept=".pdf,image/*" />
          </label>
          <button className="cd-btn-primary" style={{marginTop:"12px"}}>رفع الملف</button>
        </div>
      )}
    </div>
  );
}


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // نظام التنبيهات والتأكيد المخصص
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3500); };
  const askConfirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  // ── بيانات المركز ──
  const [center, setCenter] = useState(null);
  const [courses, setCourses] = useState([]);
  const [centerBookings, setCenterBookings] = useState([]);

  // ── بيانات الأدمن ──
  const [centers, setCenters] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [adminTab, setAdminTab] = useState("centers");

  // ── فورم إضافة مركز ──
  const [centerName, setCenterName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [activities, setActivities] = useState("");
  const [tradeNumber, setTradeNumber] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [license, setLicense] = useState(null);
  const [centerSuccess, setCenterSuccess] = useState("");

  // ── فورم الدورات ──
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseTime, setCourseTime] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDays, setCourseDays] = useState("");
  const [courseSuccess, setCourseSuccess] = useState("");

  // ── فورم تعديل دورة ──
  const [editingCourse, setEditingCourse] = useState(null);
  const [editName, setEditName] = useState("");
  const [editInstructor, setEditInstructor] = useState("");
  const [editType, setEditType] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editDays, setEditDays] = useState("");

  useEffect(() => {
    if (role === "admin") {
      Promise.all([API.get("/centers/all"), API.get("/bookings/all")])
        .then(([centersRes, bookingsRes]) => {
          setCenters(centersRes.data);
          setAllBookings(bookingsRes.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    if (role === "center") {
      Promise.all([API.get("/centers/mine"), API.get("/bookings/center")])
        .then(([centerRes, bookingsRes]) => {
          setCenter(centerRes.data);
          setCenterBookings(bookingsRes.data);
          if (centerRes.data?.id) {
            API.get(`/centers/${centerRes.data.id}/courses`)
              .then(r => setCourses(r.data))
              .catch(() => {});
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [role]);

  // ── أكشنز الأدمن ──
  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setCenters(centers.map(c => c.id === id ? { ...c, approved: true } : c));
    } catch { alert("فشل اعتماد المركز."); }
  };
  const handleDeleteCenter = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setCenters(centers.filter(c => c.id !== id));
    } catch { alert("فشل حذف المركز."); }
  };

  // ── أكشنز المركز ──
  const handleSubmitCenter = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      let licenseUrl = null;
      if (image) {
        const imgForm = new FormData();
        imgForm.append('image', image);
        const imgRes = await API.post('/upload', imgForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = imgRes.data.url;
      }
      if (license) {
        const licForm = new FormData();
        licForm.append('document', license);
        const licRes = await API.post('/upload/document', licForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        licenseUrl = licRes.data.url;
      }
      const res = await API.post('/centers', { name: centerName, location: location, description: description, image: imageUrl, license_file: licenseUrl });
      setCenter(res.data);
      setCenterSuccess('تم إرسال طلب المركز بنجاح، سيتم مراجعته من قبل الإدارة.');
      setTimeout(() => setCenterSuccess(''), 4000);
    } catch { alert('فشل إرسال طلب المركز.'); }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const res = await API.patch(`/bookings/${id}/status`, { status });
      setCenterBookings(centerBookings.map(b => b.id === id ? { ...b, status: res.data.status } : b));
    } catch { alert("فشل تحديث حالة الحجز."); }
  };

  const handleConfirmBooking = (id) => {
    askConfirm("هل أنت متأكد من قبول هذا الحجز؟", async () => {
      try {
        const res = await API.patch(`/bookings/${id}/status`, { status: "confirmed" });
        setCenterBookings(centerBookings.map(b => b.id === id ? { ...b, status: res.data.status } : b));
        showToast("success", "تم قبول الحجز بنجاح.");
      } catch { showToast("error", "فشل تحديث حالة الحجز."); }
    });
  };

  const handleRejectBooking = (id) => {
    askConfirm("هل أنت متأكد من رفض هذا الحجز؟ سيتم إزالته من القائمة.", async () => {
      try {
        await API.patch(`/bookings/${id}/status`, { status: "cancelled" });
        setCenterBookings(centerBookings.filter(b => b.id !== id));
        showToast("success", "تم رفض الحجز وإزالته من القائمة.");
      } catch { showToast("error", "فشل رفض الحجز."); }
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/courses", {
        name: courseName, description: courseType, instructor: courseInstructor,
        times: courseTime, days: courseDays, duration: courseDuration,
        price: coursePrice, center_id: center.id,
      });
      setCourses([...courses, res.data]);
      setCourseName(""); setCourseInstructor(""); setCourseType("");
      setCourseTime(""); setCoursePrice(""); setCourseDuration(""); setCourseDays("");
      setShowCourseForm(false);
      setCourseSuccess("تمت إضافة الدورة بنجاح.");
      setTimeout(() => setCourseSuccess(""), 4000);
    } catch (err) { alert(err.response?.data?.message || "فشل إضافة الدورة."); }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setEditName(course.name); setEditInstructor(course.instructor || "");
    setEditType(course.description || ""); setEditTime(course.times || "");
    setEditPrice(course.price || ""); setEditDuration(course.duration || "");
    setEditDays(course.days || "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/courses/${editingCourse.id}`, {
        name: editName, description: editType, instructor: editInstructor,
        times: editTime, days: editDays, duration: editDuration, price: editPrice,
      });
      setCourses(courses.map(c => c.id === editingCourse.id ? res.data : c));
      setEditingCourse(null);
      setCourseSuccess("تم تعديل الدورة بنجاح.");
      setTimeout(() => setCourseSuccess(""), 4000);
    } catch (err) { alert(err.response?.data?.message || "فشل تعديل الدورة."); }
  };

  const handleDeleteCourse = async (id) => {
    askConfirm("هل أنت متأكد من حذف هذه الدورة؟", async () => {
      try {
        await API.delete(`/courses/${id}`);
        setCourses(courses.filter(c => c.id !== id));
        showToast("success", "تم حذف الدورة بنجاح.");
      } catch (err) { showToast("error", err.response?.data?.message || "فشل حذف الدورة."); }
    });
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const statusLabel = s => s === "pending" ? "قيد الانتظار" : s === "confirmed" ? "مؤكد" : "ملغي";

  const pending   = centerBookings.filter(b => b.status === "pending").length;
  const confirmed = centerBookings.filter(b => b.status === "confirmed").length;
  const cancelled = centerBookings.filter(b => b.status === "cancelled").length;

  if (loading) return <div className="cd-loader"><div className="cd-spinner"></div></div>;

  // ── Sidebar items حسب الدور ──
  const centerNavItems = [
    { key: "home",     icon: <FiHome />,     label: "لوحة التحكم" },
    { key: "courses",  icon: <FiBookOpen />, label: "دوراتي" },
    { key: "bookings", icon: <FiCalendar />, label: "الحجوزات" },
    { key: "profile",  icon: <FiUser />,     label: "الملف التعريفي" },
    { key: "settings", icon: <FiSettings />, label: "الإعدادات" },
  ];
  const adminNavItems = [
    { key: "centers",  icon: <FiUsers />,    label: "المراكز" },
    { key: "bookings", icon: <FiCalendar />, label: "الحجوزات" },
  ];
  const navItems = role === "admin" ? adminNavItems : centerNavItems;

  return (
    <div className="cd-root" dir="rtl">

      {/* ══ Sidebar ══ */}
      <aside className={`cd-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="cd-sidebar-logo">
          {sidebarOpen && <span className="cd-logo-text">جيل</span>}
          <button className="cd-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
        </div>

        {sidebarOpen && (
          <div className="cd-sidebar-role">
            {role === "admin"
              ? <><FiShield className="cd-role-icon admin" /><span>الإدارة</span></>
              : <><FiUser className="cd-role-icon center" /><span>{center?.name || "المركز"}</span></>
            }
          </div>
        )}

        {/* زر الرجوع للموقع الرئيسي */}
        <button
          className="cd-nav-item cd-home-link"
          onClick={() => navigate("/")}
          title={!sidebarOpen ? "الصفحة الرئيسية" : ""}
        >
          <span className="cd-nav-icon"><FiHome /></span>
          {sidebarOpen && <span className="cd-nav-label">الصفحة الرئيسية</span>}
          {!sidebarOpen && <span className="cd-nav-tooltip">الصفحة الرئيسية</span>}
        </button>

        <nav className="cd-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`cd-nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="cd-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="cd-nav-label">{item.label}</span>}
              {!sidebarOpen && <span className="cd-nav-tooltip">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="cd-nav-item cd-logout" onClick={handleLogout} title={!sidebarOpen ? "تسجيل الخروج" : ""}>
          <span className="cd-nav-icon"><FiLogOut /></span>
          {sidebarOpen && <span className="cd-nav-label">تسجيل الخروج</span>}
          {!sidebarOpen && <span className="cd-nav-tooltip">تسجيل الخروج</span>}
        </button>
      </aside>

      {/* ══ Main ══ */}
      <main className="cd-main">

        {/* ════════════════ لوحة الأدمن ════════════════ */}
        {role === "admin" && (
          <>
            {/* كاردات إحصائيات الأدمن */}
            <div className="cd-page-header">
              <div>
                <h1>لوحة الإدارة</h1>
                <p>إدارة المراكز والحجوزات</p>
              </div>
            </div>

            <div className="cd-stats-grid" style={{marginBottom:"28px"}}>
              <div className="cd-stat-card" style={{"--accent":"#f97316"}}>
                <div className="cd-stat-icon" style={{background:"#fff7ed"}}><FiUsers style={{color:"#f97316"}} /></div>
                <div className="cd-stat-info"><h3>{centers.length}</h3><p>إجمالي المراكز</p></div>
              </div>
              <div className="cd-stat-card" style={{"--accent":"#10b981"}}>
                <div className="cd-stat-icon" style={{background:"#ecfdf5"}}><FiCheckCircle style={{color:"#10b981"}} /></div>
                <div className="cd-stat-info"><h3>{centers.filter(c => c.approved).length}</h3><p>مراكز معتمدة</p></div>
              </div>
              <div className="cd-stat-card" style={{"--accent":"#8b5cf6"}}>
                <div className="cd-stat-icon" style={{background:"#f5f3ff"}}><FiSettings style={{color:"#8b5cf6"}} /></div>
                <div className="cd-stat-info"><h3>{centers.filter(c => !c.approved).length}</h3><p>قيد المراجعة</p></div>
              </div>
              <div className="cd-stat-card" style={{"--accent":"#06b6d4"}}>
                <div className="cd-stat-icon" style={{background:"#ecfeff"}}><FiCalendar style={{color:"#06b6d4"}} /></div>
                <div className="cd-stat-info"><h3>{allBookings.length}</h3><p>إجمالي الحجوزات</p></div>
              </div>
            </div>

            {/* تبويبات الأدمن */}
            <div className="cd-admin-tabs">
              <button
                className={`cd-admin-tab ${adminTab === "centers" ? "active" : ""}`}
                onClick={() => { setAdminTab("centers"); setActiveSection("centers"); }}
              >
                المراكز
              </button>
              <button
                className={`cd-admin-tab ${adminTab === "bookings" ? "active" : ""}`}
                onClick={() => { setAdminTab("bookings"); setActiveSection("bookings"); }}
              >
                الحجوزات
              </button>
            </div>

            {/* جدول المراكز */}
            {(activeSection === "centers" || adminTab === "centers") && activeSection !== "bookings" && (
              <div className="cd-card">
                <div className="cd-card-header">
                  <h2>قائمة المراكز</h2>
                  <span className="cd-count-badge">{centers.length} مركز</span>
                </div>
                {centers.length === 0 ? (
                  <p className="cd-empty">لا توجد مراكز بعد</p>
                ) : (
                  <div className="cd-admin-cards">
                    {centers.map(c => (
                      <div key={c.id} className="cd-admin-center-card">
                        <div className="cd-admin-center-avatar">{c.name?.[0]}</div>
                        <div className="cd-admin-center-info">
                          <strong>{c.name}</strong>
                          <span>{c.location}</span>
                          <p>{c.description}</p>
                        </div>
                        <div className="cd-admin-center-actions">
                          <span className={`cd-badge ${c.approved ? "confirmed" : "pending"}`}>
                            {c.approved ? "معتمد" : "قيد المراجعة"}
                          </span>
                          <div className="cd-actions" style={{marginTop:"8px"}}>
                            {!c.approved && (
                              <button className="cd-btn-approve" onClick={() => handleApprove(c.id)}>اعتماد</button>
                            )}
                            <button className="cd-btn-reject" onClick={() => handleDeleteCenter(c.id)}>حذف</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* جدول حجوزات الأدمن */}
            {activeSection === "bookings" && (
              <div className="cd-card">
                <div className="cd-card-header">
                  <h2>جميع الحجوزات</h2>
                  <span className="cd-count-badge">{allBookings.length} حجز</span>
                </div>
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>المركز</th>
                      <th>الدورة</th>
                      <th>المستخدم</th>
                      <th>التاريخ</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.length === 0 ? (
                      <tr><td colSpan="5" className="cd-empty">لا توجد حجوزات بعد</td></tr>
                    ) : allBookings.map(b => (
                      <tr key={b.id}>
                        <td>{b.center_name}</td>
                        <td>{b.course_name}</td>
                        <td>
                          <div className="cd-avatar-row">
                            <div className="cd-avatar">{b.email?.[0]?.toUpperCase()}</div>
                            <span>{b.email}</span>
                          </div>
                        </td>
                        <td>{new Date(b.date).toLocaleDateString("ar-SA")}</td>
                        <td><span className={`cd-badge ${b.status}`}>{statusLabel(b.status)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ════════════════ لوحة المركز ════════════════ */}
        {role === "center" && (
          <>
            {/* لا يوجد مركز */}
            {!center && (
              <div className="cd-section">
                <div className="cd-page-header">
                  <div><h1>إضافة مركز جديد</h1><p>أدخل بيانات مركزك لإرسالها للمراجعة</p></div>
                </div>
                {centerSuccess && <div className="cd-success">{centerSuccess}</div>}
                <div className="cd-card">
                  <form onSubmit={handleSubmitCenter} className="cd-form">
                    <input className="cd-input" placeholder="اسم المركز *" value={centerName} onChange={e => setCenterName(e.target.value)} required />
                    <input className="cd-input" placeholder="اسم المالك *" value={ownerName} onChange={e => setOwnerName(e.target.value)} required />
                    <input className="cd-input" placeholder="الموقع *" value={location} onChange={e => setLocation(e.target.value)} required />
                    <input className="cd-input" placeholder="الأنشطة *" value={activities} onChange={e => setActivities(e.target.value)} required />
                    <input className="cd-input" placeholder="رقم السجل التجاري *" value={tradeNumber} onChange={e => setTradeNumber(e.target.value)} required />
                    <textarea className="cd-input cd-textarea" placeholder="الوصف *" value={description} onChange={e => setDescription(e.target.value)} />
                    <label className="cd-file-label">صورة المركز<input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} /></label>
                    <label className="cd-file-label">ملف الترخيص<input type="file" onChange={e => setLicense(e.target.files[0])} /></label>
                    <button type="submit" className="cd-btn-primary">إرسال للمراجعة</button>
                  </form>
                </div>
              </div>
            )}

            {/* المركز قيد المراجعة */}
            {center && !center.approved && (
              <div className="cd-section">
                <div className="cd-card cd-pending-card">
                  <div className="cd-pending-icon"><FiCheckCircle /></div>
                  <h2>{center.name}</h2>
                  <p>طلب المركز قيد المراجعة من قبل الإدارة</p>
                  <span className="cd-badge pending">قيد المراجعة</span>
                </div>
              </div>
            )}

            {/* المركز معتمد */}
            {center && center.approved && (
              <>
                {/* لوحة التحكم الرئيسية */}
                {activeSection === "home" && (
                  <div className="cd-section">
                    <div className="cd-page-header">
                      <div>
                        <h1>مرحباً، {center.name}</h1>
                        <p>إدارة مركزك، دوراتك وحجوزاتك بكل سهولة</p>
                      </div>
                    </div>

                    <div className="cd-stats-grid">
                      <div className="cd-stat-card" style={{"--accent":"#f97316"}}>
                        <div className="cd-stat-icon" style={{background:"#fff7ed"}}><FiCalendar style={{color:"#f97316"}} /></div>
                        <div className="cd-stat-info"><h3>{confirmed}</h3><p>حجوزات مكتملة</p></div>
                        <button className="cd-stat-link" onClick={() => setActiveSection("bookings")}>عرض التفاصيل</button>
                      </div>
                      <div className="cd-stat-card" style={{"--accent":"#8b5cf6"}}>
                        <div className="cd-stat-icon" style={{background:"#f5f3ff"}}><FiCheckCircle style={{color:"#8b5cf6"}} /></div>
                        <div className="cd-stat-info"><h3>{pending}</h3><p>حجوزات قيد الانتظار</p></div>
                        <button className="cd-stat-link" onClick={() => setActiveSection("bookings")}>عرض التفاصيل</button>
                      </div>
                      <div className="cd-stat-card" style={{"--accent":"#06b6d4"}}>
                        <div className="cd-stat-icon" style={{background:"#ecfeff"}}><FiUsers style={{color:"#06b6d4"}} /></div>
                        <div className="cd-stat-info"><h3>{centerBookings.length}</h3><p>إجمالي الحجوزات</p></div>
                        <button className="cd-stat-link" onClick={() => setActiveSection("bookings")}>عرض التفاصيل</button>
                      </div>
                      <div className="cd-stat-card" style={{"--accent":"#10b981"}}>
                        <div className="cd-stat-icon" style={{background:"#ecfdf5"}}><FiBookOpen style={{color:"#10b981"}} /></div>
                        <div className="cd-stat-info"><h3>{courses.length}</h3><p>إجمالي الدورات</p></div>
                        <button className="cd-stat-link" onClick={() => setActiveSection("courses")}>عرض التفاصيل</button>
                      </div>
                    </div>

                    <div className="cd-home-grid">
                      <div className="cd-card">
                        <div className="cd-card-header">
                          <h2>أحدث الحجوزات</h2>
                          <button className="cd-view-all" onClick={() => setActiveSection("bookings")}>عرض الكل</button>
                        </div>
                        <table className="cd-table">
                          <thead><tr><th>ولي الأمر</th><th>الدورة</th><th>التاريخ</th><th>الحالة</th></tr></thead>
                          <tbody>
                            {centerBookings.length === 0 ? (
                              <tr><td colSpan="4" className="cd-empty">لا توجد حجوزات حالياً</td></tr>
                            ) : centerBookings.slice(0,5).map(b => (
                              <tr key={b.id}>
                                <td><div className="cd-avatar-row"><div className="cd-avatar">{b.email?.[0]?.toUpperCase()}</div><span>{b.email}</span></div></td>
                                <td>{b.course_name}</td>
                                <td>{new Date(b.date).toLocaleDateString("ar-SA")}</td>
                                <td><span className={`cd-badge ${b.status}`}>{statusLabel(b.status)}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="cd-card">
                        <div className="cd-card-header">
                          <h2>الدورات</h2>
                          <button className="cd-btn-primary cd-btn-sm" onClick={() => { setActiveSection("courses"); setShowCourseForm(true); }}>
                            <FiPlus /> إضافة دورة جديدة
                          </button>
                        </div>
                        <div className="cd-courses-list">
                          {courses.length === 0 ? (
                            <p className="cd-empty">لا توجد دورات مضافة حالياً</p>
                          ) : courses.slice(0,5).map(course => (
                            <div key={course.id} className="cd-course-row">
                              <div className="cd-course-thumb"><FiBookOpen /></div>
                              <div className="cd-course-info">
                                <strong>{course.name}</strong>
                                <span>{course.days} — {course.times}</span>
                              </div>
                              <span className="cd-price">{course.price} ريال</span>
                            </div>
                          ))}
                        </div>
                        {courses.length > 5 && (
                          <button className="cd-view-all" onClick={() => setActiveSection("courses")}>عرض كل الدورات</button>
                        )}
                      </div>
                    </div>

                    <div className="cd-bottom-grid">
                      <div className="cd-card cd-calendar-card">
                        <div className="cd-card-header"><h2>التقويم</h2></div>
                        <MiniCalendar courses={courses} />
                        <div className="cd-cal-legend">
                          {[...new Set(courses.map(c => c.description).filter(Boolean))].slice(0,6).map(type => (
                            <div key={type} className="cd-legend-item">
                              <span className="cd-legend-dot" style={{ background: getTypeColor(type) }}></span>
                              <span>{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="cd-card cd-quick-stats">
                        <div className="cd-card-header"><h2>إحصائيات سريعة</h2></div>
                        <div className="cd-quick-list">
                          <div className="cd-quick-item"><span>دورات نشطة</span><strong>{courses.length}</strong></div>
                          <div className="cd-quick-item"><span>حجوزات مؤكدة</span><strong>{confirmed}</strong></div>
                          <div className="cd-quick-item"><span>حجوزات ملغية</span><strong>{cancelled}</strong></div>
                          <div className="cd-quick-item"><span>إجمالي الحجوزات</span><strong>{centerBookings.length}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* دوراتي */}
                {activeSection === "courses" && (
                  <div className="cd-section">
                    <div className="cd-page-header">
                      <div><h1>دوراتي</h1><p>إدارة الدورات المقدمة من المركز</p></div>
                      <button className="cd-btn-primary" onClick={() => { setShowCourseForm(!showCourseForm); setEditingCourse(null); }}>
                        <FiPlus /> إضافة دورة جديدة
                      </button>
                    </div>
                    {courseSuccess && <div className="cd-success">{courseSuccess}</div>}

                    {showCourseForm && !editingCourse && (
                      <div className="cd-card cd-form-card">
                        <h3>إضافة دورة جديدة</h3>
                        <form onSubmit={handleAddCourse} className="cd-form cd-form-grid">
                          <input className="cd-input" placeholder="اسم الدورة *" value={courseName} onChange={e => setCourseName(e.target.value)} required />
                          <input className="cd-input" placeholder="اسم المدرب *" value={courseInstructor} onChange={e => setCourseInstructor(e.target.value)} required />
                          <select className="cd-input cd-select" value={courseType} onChange={e => setCourseType(e.target.value)} required>
                            <option value="">اختر النوع *</option>
                            <option value="برمجة">برمجة</option>
                            <option value="فن">فن</option>
                            <option value="رياضة">رياضة</option>
                            <option value="موسيقى">موسيقى</option>
                            <option value="لغات">لغات</option>
                            <option value="علوم">علوم</option>
                            <option value="رياضيات">رياضيات</option>
                            <option value="طبخ">طبخ</option>
                            <option value="روبوتيك">روبوتيك</option>
                            <option value="أخرى">أخرى</option>
                          </select>
                          <select className="cd-input cd-select" value={courseTime} onChange={e => setCourseTime(e.target.value)} required>
                            <option value="">اختر الوقت *</option>
                            <option value="8:00 ص - 9:00 ص">8:00 ص - 9:00 ص</option>
                            <option value="9:00 ص - 10:00 ص">9:00 ص - 10:00 ص</option>
                            <option value="10:00 ص - 11:00 ص">10:00 ص - 11:00 ص</option>
                            <option value="11:00 ص - 12:00 م">11:00 ص - 12:00 م</option>
                            <option value="12:00 م - 1:00 م">12:00 م - 1:00 م</option>
                            <option value="1:00 م - 2:00 م">1:00 م - 2:00 م</option>
                            <option value="2:00 م - 3:00 م">2:00 م - 3:00 م</option>
                            <option value="3:00 م - 4:00 م">3:00 م - 4:00 م</option>
                            <option value="4:00 م - 5:00 م">4:00 م - 5:00 م</option>
                            <option value="5:00 م - 6:00 م">5:00 م - 6:00 م</option>
                            <option value="6:00 م - 7:00 م">6:00 م - 7:00 م</option>
                            <option value="7:00 م - 8:00 م">7:00 م - 8:00 م</option>
                            <option value="8:00 م - 9:00 م">8:00 م - 9:00 م</option>
                          </select>
                          <div className="cd-date-field">
                            <label className="cd-date-label">تاريخ البدء *</label>
                            <input className="cd-input" type="date" value={courseDays} min={new Date().toISOString().split("T")[0]} onChange={e => setCourseDays(e.target.value)} required />
                          </div>
                          <input className="cd-input" placeholder="مدة الدورة *" value={courseDuration} onChange={e => setCourseDuration(e.target.value)} required />
                          <input className="cd-input" placeholder="السعر (ريال) *" value={coursePrice} onChange={e => setCoursePrice(e.target.value)} required />
                          <div className="cd-form-actions">
                            <button type="submit" className="cd-btn-primary">إضافة الدورة</button>
                            <button type="button" className="cd-btn-secondary" onClick={() => setShowCourseForm(false)}>إلغاء</button>
                          </div>
                        </form>
                      </div>
                    )}

                    {editingCourse && (
                      <div className="cd-card cd-form-card cd-edit-card">
                        <div className="cd-form-header">
                          <h3>تعديل الدورة</h3>
                          <button className="cd-icon-btn" onClick={() => setEditingCourse(null)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="cd-form cd-form-grid">
                          <input className="cd-input" placeholder="اسم الدورة *" value={editName} onChange={e => setEditName(e.target.value)} required />
                          <input className="cd-input" placeholder="اسم المدرب *" value={editInstructor} onChange={e => setEditInstructor(e.target.value)} required />
                          <select className="cd-input cd-select" value={editType} onChange={e => setEditType(e.target.value)} required>
                            <option value="">اختر النوع *</option>
                            <option value="برمجة">برمجة</option>
                            <option value="فن">فن</option>
                            <option value="رياضة">رياضة</option>
                            <option value="موسيقى">موسيقى</option>
                            <option value="لغات">لغات</option>
                            <option value="علوم">علوم</option>
                            <option value="رياضيات">رياضيات</option>
                            <option value="طبخ">طبخ</option>
                            <option value="روبوتيك">روبوتيك</option>
                            <option value="أخرى">أخرى</option>
                          </select>
                          <select className="cd-input cd-select" value={editTime} onChange={e => setEditTime(e.target.value)} required>
                            <option value="">اختر الوقت *</option>
                            <option value="8:00 ص - 9:00 ص">8:00 ص - 9:00 ص</option>
                            <option value="9:00 ص - 10:00 ص">9:00 ص - 10:00 ص</option>
                            <option value="10:00 ص - 11:00 ص">10:00 ص - 11:00 ص</option>
                            <option value="11:00 ص - 12:00 م">11:00 ص - 12:00 م</option>
                            <option value="12:00 م - 1:00 م">12:00 م - 1:00 م</option>
                            <option value="1:00 م - 2:00 م">1:00 م - 2:00 م</option>
                            <option value="2:00 م - 3:00 م">2:00 م - 3:00 م</option>
                            <option value="3:00 م - 4:00 م">3:00 م - 4:00 م</option>
                            <option value="4:00 م - 5:00 م">4:00 م - 5:00 م</option>
                            <option value="5:00 م - 6:00 م">5:00 م - 6:00 م</option>
                            <option value="6:00 م - 7:00 م">6:00 م - 7:00 م</option>
                            <option value="7:00 م - 8:00 م">7:00 م - 8:00 م</option>
                            <option value="8:00 م - 9:00 م">8:00 م - 9:00 م</option>
                          </select>
                          <div className="cd-date-field">
                            <label className="cd-date-label">تاريخ البدء *</label>
                            <input className="cd-input" type="date" value={editDays} min={new Date().toISOString().split("T")[0]} onChange={e => setEditDays(e.target.value)} required />
                          </div>
                          <input className="cd-input" placeholder="مدة الدورة *" value={editDuration} onChange={e => setEditDuration(e.target.value)} required />
                          <input className="cd-input" placeholder="السعر (ريال) *" value={editPrice} onChange={e => setEditPrice(e.target.value)} required />
                          <div className="cd-form-actions">
                            <button type="submit" className="cd-btn-primary">حفظ التعديلات</button>
                            <button type="button" className="cd-btn-secondary" onClick={() => setEditingCourse(null)}>إلغاء</button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="cd-card">
                      <table className="cd-table">
                        <thead>
                          <tr><th>الدورة</th><th>المدرب</th><th>التصنيف</th><th>الأيام</th><th>الوقت</th><th>السعر</th><th>الإجراءات</th></tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr><td colSpan="7" className="cd-empty">لا توجد دورات مضافة حالياً</td></tr>
                          ) : courses.map(course => (
                            <tr key={course.id}>
                              <td><strong>{course.name}</strong></td>
                              <td>{course.instructor}</td>
                              <td>{course.description}</td>
                              <td>{course.days}</td>
                              <td>{course.times}</td>
                              <td><span className="cd-price">{course.price} ريال</span></td>
                              <td>
                                <div className="cd-actions">
                                  <button className="cd-icon-btn edit" onClick={() => { setShowCourseForm(false); handleOpenEdit(course); }} title="تعديل"><FiEdit2 /></button>
                                  <button className="cd-icon-btn delete" onClick={() => handleDeleteCourse(course.id)} title="حذف"><FiTrash2 /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* الحجوزات */}
                {activeSection === "bookings" && (
                  <div className="cd-section">
                    <div className="cd-page-header">
                      <div><h1>الحجوزات</h1><p>عرض الحجوزات الخاصة بدورات المركز</p></div>
                    </div>
                    <div className="cd-stats-grid cd-stats-sm">
                      <div className="cd-stat-mini" style={{borderColor:"#f97316"}}><h3>{centerBookings.length}</h3><p>إجمالي</p></div>
                      <div className="cd-stat-mini" style={{borderColor:"#8b5cf6"}}><h3>{pending}</h3><p>قيد الانتظار</p></div>
                      <div className="cd-stat-mini" style={{borderColor:"#10b981"}}><h3>{confirmed}</h3><p>مؤكدة</p></div>
                      <div className="cd-stat-mini" style={{borderColor:"#ef4444"}}><h3>{cancelled}</h3><p>ملغية</p></div>
                    </div>
                    <div className="cd-card">
                      <table className="cd-table">
                        <thead><tr><th>ولي الأمر</th><th>الدورة</th><th>تاريخ الحجز</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
                        <tbody>
                          {centerBookings.length === 0 ? (
                            <tr><td colSpan="5" className="cd-empty">لا توجد حجوزات حالياً</td></tr>
                          ) : centerBookings.map(b => (
                            <tr key={b.id}>
                              <td><div className="cd-avatar-row"><div className="cd-avatar">{b.email?.[0]?.toUpperCase()}</div><span>{b.email}</span></div></td>
                              <td>{b.course_name}</td>
                              <td>{new Date(b.date).toLocaleDateString("ar-SA")}</td>
                              <td><span className={`cd-badge ${b.status}`}>{statusLabel(b.status)}</span></td>
                              <td>
                                <div className="cd-actions">
                                  {b.status === "pending" && (
                                    <>
                                      <button className="cd-btn-approve" onClick={() => handleConfirmBooking(b.id)}>قبول</button>
                                      <button className="cd-btn-reject" onClick={() => handleRejectBooking(b.id)}>رفض</button>
                                    </>
                                  )}
                                  {b.status === "confirmed" && (
                                    <button className="cd-btn-undo" onClick={() => handleUpdateBookingStatus(b.id, "pending")}>إلغاء القبول</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* الملف التعريفي */}
                {activeSection === "profile" && (
                  <div className="cd-section">
                    <div className="cd-page-header"><h1>الملف التعريفي</h1></div>
                    <div className="cd-card cd-profile-card">
                      <div className="cd-profile-header">
                        <div className="cd-profile-avatar">{center.name?.[0]}</div>
                        <div>
                          <h2>{center.name}</h2>
                          <p>{center.location}</p>
                          <span className="cd-badge confirmed">معتمد</span>
                        </div>
                      </div>
                      <div className="cd-profile-body">
                        <div className="cd-profile-field"><label>الوصف</label><p>{center.description}</p></div>
                        <div className="cd-profile-field"><label>الموقع</label><p>{center.location}</p></div>
                        <div className="cd-profile-field"><label>عدد الدورات</label><p>{courses.length} دورة</p></div>
                        <div className="cd-profile-field"><label>إجمالي الحجوزات</label><p>{centerBookings.length} حجز</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* الإعدادات */}
                {activeSection === "settings" && (
                  <SettingsSection center={center} />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Toast إشعار */}
      {toast && (
        <div className={`cd-toast ${toast.type}`}>
          {toast.type === "success" ? <FiCheckCircle /> : <FiX />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modal تأكيد */}
      {confirmModal && (
        <div className="cd-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <div className="cd-modal-icon"><FiCheckCircle /></div>
            <p className="cd-modal-message">{confirmModal.message}</p>
            <div className="cd-modal-actions">
              <button
                className="cd-btn-primary"
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              >
                تأكيد
              </button>
              <button className="cd-btn-secondary" onClick={() => setConfirmModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;