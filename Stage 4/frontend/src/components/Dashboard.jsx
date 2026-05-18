
import { useState, useEffect } from "react";
import API from "../api/axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const [activeTab, setActiveTab] = useState("centers");
  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [license, setLicense] = useState(null);
  const [editing, setEditing] = useState(false);
  const [center, setCenter] = useState(null);
  const [centerName, setCenterName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");

  useEffect(() => {
    if (role === "admin") {
      API.get("/centers/all").then(res => setCenters(res.data)).catch(() => {});
      API.get("/courses").then(res => setCourses(res.data)).catch(() => {});
      API.get("/bookings/all").then(res => setBookings(res.data)).catch(() => {});
    }
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setCenters(centers.map(c => c.id === id ? { ...c, approved: true } : c));
    } catch (err) {
      alert("Failed to approve center");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setCenters(centers.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to reject center");
    }
  };

  const handleSubmitCenter = async (e) => {
    e.preventDefault();
    if (!centerName || !location || !description) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await API.post('/centers', { name: centerName, location, description });
      setCenters([...centers, res.data]);
      setCenter(res.data);
      setCenterName("");
      setLocation("");
      setDescription("");
      alert("Center submitted for admin approval");
    } catch (err) {
      alert("Failed to submit center");
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseName || !coursePrice || !courseDuration) {
      alert("Please fill all course fields");
      return;
    }
    const newCourse = { id: Date.now(), name: courseName, price: coursePrice, duration: courseDuration, students: 0 };
    setCourses([...courses, newCourse]);
    setCourseName("");
    setCoursePrice("");
    setCourseDuration("");
  };

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
              {centers.length === 0 ? (
                <p>لا يوجد مراكز</p>
              ) : (
                centers.map(c => (
                  <div key={c.id} className="dashboard-box">
                    <h2>{c.name}</h2>
                    <p>Location: {c.location}</p>
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
              {courses.length === 0 ? (
                <p>لا يوجد كورسات</p>
              ) : (
                courses.map(c => (
                  <div key={c.id} className="dashboard-box">
                    <h2>{c.name}</h2>
                    <p>السعر: {c.price} SAR</p>
                    <p>المدة: {c.duration}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="dashboard-cards">
              {bookings.length === 0 ? (
                <p>لا يوجد حجوزات</p>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="dashboard-box">
                    <p>الكورس: {b.course_name}</p>
                    <p>المستخدم: {b.email}</p>
                    <p>التاريخ: {new Date(b.date).toLocaleDateString()}</p>
                    <p>الحالة: {b.status}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {role !== "admin" && (
        <div>
          <h1>🏫 Center Dashboard</h1>
          {!center && (
            <div className="pending-box">
              <h2>Submit Center Information</h2>
              <form onSubmit={handleSubmitCenter} className="form-container">
                <input placeholder="Center Name" value={centerName} onChange={(e) => setCenterName(e.target.value)} />
                <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="file" onChange={(e) => setLicense(e.target.files[0])} />
                <button type="submit">Submit For Approval</button>
              </form>
            </div>
          )}
          {center && !center.approved && (
            <div className="pending-box">
              <h2>{center.name}</h2>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
              {editing && (
                <div className="edit-box">
                  <input value={center.name} onChange={(e) => setCenter({ ...center, name: e.target.value })} />
                  <input value={center.location} onChange={(e) => setCenter({ ...center, location: e.target.value })} />
                  <textarea value={center.description} onChange={(e) => setCenter({ ...center, description: e.target.value })} />
                  <button onClick={() => setEditing(false)}>Save Changes</button>
                </div>
              )}
              <p>⏳ Waiting for admin approval</p>
              <p>Location: {center.location}</p>
              <p>{center.description}</p>
            </div>
          )}
          {center && center.approved && (
            <div className="status-box">
              <h2>Welcome, {center.name}</h2>
              <h3>Add New Course</h3>
              <form onSubmit={handleAddCourse} className="form-container">
                <input placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                <input placeholder="Price" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                <input placeholder="Duration" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
                <button type="submit">Add Course</button>
              </form>
              <h3>My Courses</h3>
              {courses.length === 0 ? <p>No courses added yet.</p> : (
                courses.map(course => (
                  <div key={course.id} className="course-card">
                    <h3>{course.name}</h3>
                    <p>Price: {course.price} SAR</p>
                    <p>Duration: {course.duration}</p>
                    <p>Students Joined: {course.students}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
