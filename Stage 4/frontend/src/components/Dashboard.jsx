import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const [activeTab, setActiveTab] = useState("centers");
  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [center, setCenter] = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseSuccess, setCourseSuccess] = useState("");
  const [centerSuccess, setCenterSuccess] = useState("");
const [courseDate, setCourseDate] = useState("");
const [license, setLicense] = useState("");

  const [centerName, setCenterName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [activities, setActivities] = useState("");
  const [tradeNumber, setTradeNumber] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseTime, setCourseTime] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDays, setCourseDays] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      Promise.all([
        API.get("/centers/all"),
        API.get("/bookings/all"),
      ]).then(([centersRes, bookingsRes]) => {
        setCenters(centersRes.data);
        setBookings(bookingsRes.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }

    if (role === "center") {
      Promise.all([
        API.get("/centers/mine"),
        API.get("/bookings/center"),
      ]).then(([centerRes, bookingsRes]) => {
        setCenter(centerRes.data);
        setCenterBookings(bookingsRes.data);
        if (centerRes.data?.id) {
          API.get(`/centers/${centerRes.data.id}/courses`)
            .then(r => setCourses(r.data))
            .catch(() => {});
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [role, window.location.pathname]);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setCenters(centers.map(c => c.id === id ? { ...c, approved: true } : c));
    } catch (err) {
      alert("Failed to approve center.");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setCenters(centers.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to reject center.");
    }
  };

  const handleSubmitCenter = async (e) => {
    e.preventDefault();
    if (!centerName || !location || !description) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const formData = new FormData();

formData.append("name", centerName);
formData.append("location", location);
formData.append("description", description);

if (image) {
  formData.append("image", image);
}

const res = await API.post("/centers", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

setCenter(res.data);

      setCenterSuccess("✅ تم إرسال طلب المركز بنجاح! سيتم مراجعته من قبل الإدارة.");
      setTimeout(() => setCenterSuccess(""), 4000);
    } catch (err) {
      alert("Failed to submit center.");
    }
  };
const handleUpdateBookingStatus = async (id, status) => {
  try {
    const res = await API.patch(`/bookings/${id}/status`, { status });

    setCenterBookings(
      centerBookings.map((b) =>
        b.id === id ? { ...b, status: res.data.status } : b
      )
    );
  } catch (err) {
    alert("فشل تحديث حالة الحجز");
  }
};

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/courses", {
        name: courseName,
        description: courseType,
        instructor: courseInstructor,
        times: courseTime,
        days: courseDays,
        duration: courseDuration,
        price: coursePrice,
        center_id: center.id,
      });
      setCourses([...courses, res.data]);
      setCourseName("");
      setCourseInstructor("");
      setCourseType("");
      setCourseTime("");
      setCourseDate("");
      setCoursePrice("");
      setCourseDuration("");
      setCourseDays("");
      setShowCourseForm(false);
      setCourseSuccess("✅ تمت إضافة الكورس بنجاح! يمكن للأهل حجزه الآن.");
      setTimeout(() => setCourseSuccess(""), 4000);
    } catch (err) {
      alert("Failed to add course.");
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="dashboard-page">

      {role === "admin" && (
        <div>
          <h1>🛡️ Admin Panel</h1>
          <div className="tabs">
            <button className={activeTab === "centers" ? "tab active" : "tab"} onClick={() => setActiveTab("centers")}>🏫 Centers</button>
            <button className={activeTab === "bookings" ? "tab active" : "tab"} onClick={() => setActiveTab("bookings")}>📅 Bookings</button>
          </div>
<div className="stats-grid">
  <div className="stat-card">
    <h3>{centers.length}</h3>
    <p>Total Centers</p>
  </div>

  <div className="stat-card">
    <h3>{centers.filter(c => c.approved).length}</h3>
    <p>Approved</p>
  </div>

  <div className="stat-card">
    <h3>{centers.filter(c => !c.approved).length}</h3>
    <p>Pending</p>
  </div>

  <div className="stat-card">
    <h3>{bookings.length}</h3>
    <p>Bookings</p>
  </div>
</div>
          {activeTab === "centers" && (
            <div className="dashboard-cards">
              {centers.length === 0 ? <p>No centers yet</p> : (
                centers.map(c => (
                  <div key={c.id} className="dashboard-box">
                    <h2>{c.name}</h2>
                    <p>📍 {c.location}</p>
                    <p>{c.description}</p>
                    <p>Status: {c.approved ? "Approved ✅" : "Pending ⏳"}</p>
                      <div className="admin-actions">
  {!c.approved && (
    <button onClick={() => handleApprove(c.id)}>
      Approve ✅
    </button>
  )}

  <button
    className="delete-center-btn"
    onClick={() => handleReject(c.id)}
  >
    Delete 🗑️
  </button>
</div>         
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="dashboard-cards">
              {bookings.length === 0 ? <p>No bookings yet</p> : (
                bookings.map(b => (
                  <div key={b.id} className="dashboard-box">
                    <p><strong>Center:</strong> {b.center_name}</p>
                    <p><strong>Course:</strong> {b.course_name}</p>
                    <p><strong>User:</strong> {b.email}</p>
                    <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {b.status}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {role === "center" && (
        <div>
           <h1>مركزي</h1>
              
            <div className="center-stats-grid">
  <div className="center-stat-card">
    <FiBookOpen />
    <div>
      <h3>{courses.length}</h3>
<p>إجمالي الدورات</p>
    </div>
  </div>

  <div className="center-stat-card">
    <FiCalendar />
    <div>
      <h3>{centerBookings.length}</h3>
      <p>إجمالي الحجوزات</p>
    </div>
  </div>

  <div className="center-stat-card">
    <FiClock />
    <div>
      <h3>{centerBookings.filter(b => b.status === "pending").length}</h3>
      <p>الحجوزات المعلقة</p>
    </div>
  </div>

  <div className="center-stat-card">
    <FiCheckCircle />
    <div>
      <h3>{centerBookings.filter(b => b.status === "confirmed").length}</h3>
      <p>مؤكدة</p>
    </div>
  </div>
</div>

          {centerSuccess && (
            <div style={{background:'#e8f5e9', color:'#2e7d32', padding:'14px 20px', borderRadius:'12px', marginBottom:'16px', border:'2px solid #a5d6a7', fontSize:'16px', fontWeight:'600'}}>
              {centerSuccess}
            </div>
          )}

          {!center ? (
            <div className="pending-box">
              <h2>إضافة مركز جديد</h2>
              <form onSubmit={handleSubmitCenter} className="form-container">
                <input placeholder=" اسم المركز *" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
                <input placeholder="اسم المالك *" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                <input placeholder="الموقع *" value={location} onChange={(e) => setLocation(e.target.value)} required />
                <input placeholder="الأنشطة *" value={activities} onChange={(e) => setActivities(e.target.value)} required />
                <input placeholder=" *رقم السجل التجاري" value={tradeNumber} onChange={(e) => setTradeNumber(e.target.value)} required />
                <textarea placeholder="الوصف *" value={description} onChange={(e) => setDescription(e.target.value)} />
<label> Center Image</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>
                <label>License File</label>
                <input type="file" onChange={(e) => setLicense(e.target.files[0])} />
                <button type="submit">Submit For Approval 🙏</button>
              </form>
            </div>
          ) : !center.approved ? (
            <div className="pending-box">
              <h2>{center.name}</h2>
              <p> طلب المركز قيد المراجعة من قبل الإدارة </p>
              <p> {center.location}</p>
              <p>{center.description}</p>
            </div>
          ) : (
            <div>
              <div className="dashboard-box" style={{marginBottom:'20px'}}>
                <h2>{center.name}</h2>
                <p>{center.location}</p>
                <p>{center.description}</p>
                <p>الحالة: معتمد </p>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
               <div className="center-section-header">
  <div>
    <h2>الدورات التدريبية</h2>
    <p>إدارة الدورات المقدمة من المركز</p>
  </div>

  <button
    className="add-course-btn"
    onClick={() => setShowCourseForm(!showCourseForm)}
  >
    إضافة دورة
  </button>
</div>

              </div>

              {courseSuccess && (
                <div style={{background:'#e8f5e9', color:'#2e7d32', padding:'14px 20px', borderRadius:'12px', marginBottom:'16px', border:'2px solid #a5d6a7', fontSize:'16px', fontWeight:'600'}}>
                  {courseSuccess}
                </div>
              )}

              {showCourseForm && (
                <form onSubmit={handleAddCourse} className="form-container" style={{marginBottom:'20px', background:'#f8faff', padding:'20px', borderRadius:'16px', border:'1px solid #d6e6f5'}}>
                  <h3 style={{color:'#3b5b7a', marginBottom:'15px'}}>إضافة دورة جديدة</h3>
                  <input placeholder="اسم الدورة *" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                  <input placeholder="اسم المدرب *" value={courseInstructor} onChange={(e) => setCourseInstructor(e.target.value)} required />
                  <input placeholder="النوع (مثلاً: البرمجة، الفن) *" value={courseType} onChange={(e) => setCourseType(e.target.value)} required />
                  <input placeholder="الوقت (مثلاً: 5:00 PM - 7:00 PM) *" value={courseTime} onChange={(e) => setCourseTime(e.target.value)} required />
                  <input placeholder="الأيام (مثلاً: الاثنين، الأربعاء) *" value={courseDays} onChange={(e) => setCourseDays(e.target.value)} required />
                  <input placeholder="مدة الدورة*" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} required />
                  <input placeholder="السعر (ريال) *" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required />
                  <button type="submit">إضافة دورة </button>
                </form>
              )}

             
<div className="courses-table">
  <table>
    <thead>
      <tr>
        <th>الدورة</th>
        <th>المدرب</th>
        <th>التصنيف</th>
        <th>الأيام</th>
        <th>الوقت</th>
        <th>السعر</th>
      </tr>
    </thead>

    <tbody>
      {courses.length === 0 ? (
        <tr>
          <td colSpan="6" className="empty-table">
            لا توجد دورات مضافة حالياً
          </td>
        </tr>
      ) : (
        courses.map((course) => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.instructor}</td>
            <td>{course.description}</td>
            <td>{course.days}</td>
            <td>{course.times}</td>
            <td>{course.price} ريال</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
                

<h2 className="section-title">حجوزات المركز</h2>
<p className="section-subtitle">عرض الحجوزات الخاصة بدورات المركز</p>

              {centerBookings.length > 0 && (
                <div style={{background:'#fff3e0', padding:'10px 16px', borderRadius:'10px', marginBottom:'10px', border:'2px solid #ffb74d'}}>
لديك {centerBookings.length} حجز حالياً
                </div>
              )}
              <div className="bookings-table">
  <table>
   <thead>
  <tr>
    <th>ولي الأمر</th>
    <th>الدورة</th>
    <th>تاريخ الحجز</th>
    <th>الحالة</th>
    <th>الإجراءات</th>
  </tr>
</thead>

    <tbody>
      {centerBookings.length === 0 ? (
        <tr>
          <td colSpan="5" className="empty-table">
            لا توجد حجوزات حالياً
          </td>
        </tr>
      ) : (
        centerBookings.map((b) => (
         <tr key={b.id}>
  <td>{b.email}</td>
  <td>{b.course_name}</td>
  <td>{new Date(b.date).toLocaleDateString("ar-SA")}</td>

  <td>
  <span className={`booking-status ${b.status}`}>
    {b.status === "pending"
      ? "قيد الانتظار"
      : b.status === "confirmed"
      ? "مؤكد"
      : "ملغي"}
  </span>
</td>

  <td>
   <button
  className="approve-btn"
  onClick={() => handleUpdateBookingStatus(b.id, "confirmed")}
>
  قبول
</button>

<button
  className="reject-btn"
  onClick={() => handleUpdateBookingStatus(b.id, "cancelled")}
>
  رفض
</button>
  </td>
</tr>
        ))
      )}
    </tbody>
  </table>
</div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
