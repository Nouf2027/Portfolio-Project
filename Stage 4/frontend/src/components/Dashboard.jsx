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
  const [license, setLicense] = useState(null);

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
  const [courseDate, setCourseDate] = useState("");
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
      const res = await API.post("/centers", {
        name: centerName,
        location,
        description,
      });
      setCenter(res.data);
      alert("Center submitted for admin approval ✅");
    } catch (err) {
      alert("Failed to submit center.");
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/courses", {
        title: courseName,
        instructor: courseInstructor,
        type: courseType,
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
      alert("Course added successfully ✅");
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

          {activeTab === "centers" && (
            <div className="dashboard-cards">
              {centers.length === 0 ? <p>No centers yet</p> : (
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
          <h1>🏫 My Center</h1>
          {!center ? (
            <div className="pending-box">
              <h2>Submit Center Information</h2>
              <form onSubmit={handleSubmitCenter} className="form-container">
                <input placeholder="Center Name *" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
                <input placeholder="Owner Name *" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                <input placeholder="Location *" value={location} onChange={(e) => setLocation(e.target.value)} required />
                <input placeholder="Activities *" value={activities} onChange={(e) => setActivities(e.target.value)} required />
                <input placeholder="Trade Number *" value={tradeNumber} onChange={(e) => setTradeNumber(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Center Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
                <label>License File</label>
                <input type="file" onChange={(e) => setLicense(e.target.files[0])} />
                <button type="submit">Submit For Approval 🙏</button>
              </form>
            </div>
          ) : !center.approved ? (
            <div className="pending-box">
              <h2>{center.name}</h2>
              <p>⏳ Your request is under review by admin</p>
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

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                <h3>📚 My Courses</h3>
                <button onClick={() => setShowCourseForm(!showCourseForm)}>
                  {showCourseForm ? '✕ Close' : '+ Add Course'}
                </button>
              </div>

              {showCourseForm && (
                <form onSubmit={handleAddCourse} className="form-container" style={{marginBottom:'20px', background:'#f8faff', padding:'20px', borderRadius:'16px', border:'1px solid #d6e6f5'}}>
                  <h3 style={{color:'#3b5b7a', marginBottom:'15px'}}>📚 Add New Course</h3>
                  <input placeholder="Course Name *" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                  <input placeholder="Instructor Name *" value={courseInstructor} onChange={(e) => setCourseInstructor(e.target.value)} required />
                  <input placeholder="Type (e.g. Programming, Art) *" value={courseType} onChange={(e) => setCourseType(e.target.value)} required />
                  <input placeholder="Time (e.g. 5:00 PM - 7:00 PM) *" value={courseTime} onChange={(e) => setCourseTime(e.target.value)} required />
                  <input placeholder="Days (e.g. Mon, Wed) *" value={courseDays} onChange={(e) => setCourseDays(e.target.value)} required />
                  <input placeholder="Duration (e.g. 8 weeks) *" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} required />
                  <input placeholder="Price (SAR) *" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required />
                  <button type="submit">Add Course ✅</button>
                </form>
              )}

              <div className="dashboard-cards">
                {courses.length === 0 ? <p>No courses yet.</p> : (
                  courses.map(course => (
                    <div key={course.id} className="dashboard-box">
                      <h3>{course.title || course.name}</h3>
                      <p>👨‍🏫 {course.instructor}</p>
                      <p>🎯 {course.type}</p>
                      <p>🕐 {course.times}</p>
                      <p>📅 {course.days}</p>
                      <p>⏱️ {course.duration}</p>
                      <p>💰 {course.price} SAR</p>
                    </div>
                  ))
                )}
              </div>

              <h3 style={{marginTop:'20px'}}>📅 Center Bookings</h3>
              {centerBookings.length > 0 && (
                <div style={{background:'#fff3e0', padding:'10px 16px', borderRadius:'10px', marginBottom:'10px', border:'2px solid #ffb74d'}}>
                  🔔 You have {centerBookings.length} booking(s)!
                </div>
              )}
              <div className="dashboard-cards">
                {centerBookings.length === 0 ? <p>No bookings yet.</p> : (
                  centerBookings.map(b => (
                    <div key={b.id} className="dashboard-box">
                      <p><strong>Course:</strong> {b.course_name}</p>
                      <p><strong>Student:</strong> {b.email}</p>
                      <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {b.status}</p>
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
