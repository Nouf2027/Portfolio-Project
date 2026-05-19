import { useState, useEffect } from "react";
import API from "../api/axios";

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

  // فورم إضافة المركز
  const [centerName, setCenterName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [activities, setActivities] = useState("");
  const [tradeNumber, setTradeNumber] = useState("");
  const [description, setDescription] = useState("");

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
const newCenter = {
  id: Date.now(),
  name: centerName,
  location,
  description,
  approved: false
};
  const handleApprove = (id) => {
    const updatedCenters = centers.map((center) =>
      center.id === id ? { ...center, approved: true } : center
    );

    setCenters(updatedCenters);

    const approvedCenter = updatedCenters.find((center) => center.id === id);
    setCenter(approvedCenter);
  };

  const handleSubmitCenter = (e) => {
    e.preventDefault();
    <p className="pending-text">
⏳ Waiting for admin approval
</p>
const newCenter = {
  id: Date.now(),
  name: centerName,
  location,
  description,
  license: license ? license.name : "No license uploaded",
  approved: false,
};
    if (!centerName || !location || !description) {
      alert("Please fill all fields");
      return;
    }

    setCenters([...centers, newCenter]);
    setCenter(newCenter);

    setCenterName("");
    setLocation("");
    setDescription("");

    alert("Center submitted for admin approval");
  };

  const handleSubmitCenter = async (e) => {
    e.preventDefault();
    if (!centerName || !ownerName || !location || !activities || !tradeNumber) {
      console.log("Please fill all required fields");
      return;
    }
    try {
      const res = await API.post('/centers', {
        name: centerName,
        location,
        description: `المالك: ${ownerName} | الأنشطة: ${activities} | السجل التجاري: ${tradeNumber}`
      });
      setCenter(res.data);
      
    } catch (err) {
      console.log("Failed to submit center");
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="dashboard-page">

      {role === "admin" && (
        <div>
          <h1>Admin Dashboard</h1>
          <div className="tabs">
            <button className={activeTab === "centers" ? "tab active" : "tab"} onClick={() => setActiveTab("centers")}>🏫 المراكز</button>
            <button className={activeTab === "courses" ? "tab active" : "tab"} onClick={() => setActiveTab("courses")}>📚 الكورسات</button>
            <button className={activeTab === "bookings" ? "tab active" : "tab"} onClick={() => setActiveTab("bookings")}>📅 الحجوزات</button>
          </div>

          {activeTab === "centers" && (
            <div className="dashboard-cards">
              {centers.length === 0 ? <p>لا يوجد مراكز</p> : (
                centers.map(c => (
                  <div key={c.id} className="dashboard-box">
                    <h2>{c.name}</h2>
                    <p>📍 {c.location}</p>
                    <p>{c.description}</p>
                    <p>Status: {c.approved ? "Approved ✅" : "Pending ⏳"}</p>
                    {!c.approved && (
                      <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                        <button onClick={() => handleApprove(c.id)}>Approve ✅</button>
                        <button onClick={() => handleReject(c.id)} style={{backgroundColor:'red', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}>Reject ❌</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="dashboard-cards">
              {centers.filter(c => c.approved).map(center => (
                <div key={center.id} style={{width:'100%', marginBottom:'20px'}}>
                  <h2 style={{color:'#e65100', marginBottom:'10px'}}>🏫 {center.name}</h2>
                  <div className="dashboard-cards">
                    {courses.filter(co => co.center_id === center.id).length === 0 ? (
                      <p>لا يوجد كورسات لهذا المركز</p>
                    ) : (
                      courses.filter(co => co.center_id === center.id).map(c => (
                        <div key={c.id} className="dashboard-box">
                          <h3>{c.name}</h3>
                          <p>السعر: {c.price} SAR</p>
                          <p>المدة: {c.duration}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="dashboard-cards">
              {bookings.length === 0 ? <p>لا يوجد حجوزات</p> : (
                bookings.map(b => (
                  <div key={b.id} className="dashboard-box">
                    <p><strong>المركز:</strong> {b.center_name}</p>
                    <p><strong>الكورس:</strong> {b.course_name}</p>
                    <p><strong>المستخدم:</strong> {b.email}</p>
                    <p><strong>التاريخ:</strong> {new Date(b.date).toLocaleDateString()}</p>
                    <p><strong>الحالة:</strong> {b.status}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {role === "center" && (
        <div>
          <h1>🏫 My Center</h1>
          {!center ? (
            <div className="pending-box">
              <h2>Submit Center Information</h2>
              <form onSubmit={handleSubmitCenter} className="form-container">
                <input placeholder="اسم المركز *" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
                <input placeholder="اسم المالك *" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                <input placeholder="الموقع *" value={location} onChange={(e) => setLocation(e.target.value)} required />
                <input placeholder="نوع الأنشطة *" value={activities} onChange={(e) => setActivities(e.target.value)} required />
                <input placeholder="رقم السجل التجاري *" value={tradeNumber} onChange={(e) => setTradeNumber(e.target.value)} required />
                <textarea placeholder="وصف المركز" value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>رخصة المركز (ملف)</label>
                <input type="file" onChange={(e) => setLicense(e.target.files[0])} />
                <button type="submit">Submit For Approval 🙏</button>
              </form>
            </div>
          ) : !center.approved ? (
            <div className="pending-box">
              <h2>{center.name}</h2>
              <p>⏳ طلبك قيد المراجعة من الأدمن</p>
              <p>📍 {center.location}</p>
              <p>{center.description}</p>
            </div>
          ) : (
            <div>
              <div className="dashboard-box" style={{marginBottom:'20px'}}>
                <h2>{center.name}</h2>
                <p>📍 {center.location}</p>
                <p>{center.description}</p>
                <p>Status: Approved ✅</p>
              </div>

              <h3>📚 My Courses</h3>
              <div className="dashboard-cards">
                {courses.length === 0 ? <p>No courses yet.</p> : (
                  courses.map(course => (
                    <div key={course.id} className="dashboard-box">
                      <h3>{course.name}</h3>
                      <p>Price: {course.price} SAR</p>
                      <p>Duration: {course.duration}</p>
                    </div>
                  ))
                )}
              </div>

              <h3 style={{marginTop:'20px'}}>📅 Center Bookings</h3>
              <div className="dashboard-cards">
                {centerBookings.length === 0 ? <p>No bookings yet.</p> : (
                  centerBookings.map(b => (
                    <div key={b.id} className="dashboard-box">
                      <p><strong>الكورس:</strong> {b.course_name}</p>
                      <p><strong>الطالب:</strong> {b.email}</p>
                      <p><strong>التاريخ:</strong> {new Date(b.date).toLocaleDateString()}</p>
                      <p><strong>الحالة:</strong> {b.status}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
