import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [bookings, setBookings] = useState([]);
  const [centerData, setCenterData] = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);
  const [centerCourses, setCenterCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  }
};

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
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };
  
const [isEditing, setIsEditing] = useState(false);
const [editName, setEditName] = useState(user?.name || "");
const [editEmail, setEditEmail] = useState(user?.email || "");

const handleUpdateProfile = async () => {
  try {
    const res = await API.put("/auth/update-profile", {
  id: user.id,
  name: editName,
  email: editEmail,
});

    localStorage.setItem("user", JSON.stringify(res.data.user));
    alert("Profile updated successfully");
    setIsEditing(false);
    window.location.reload();
  } catch (err) {
    alert("Failed to update profile");
  }
};

  return (
    <div className="clean-profile-page">
      <section className="clean-profile-grid">

  <div className="profile-card">
    <div className="avatar-box">
  <div className="avatar">
    {profileImage ? (
      <img src={profileImage} alt="Profile" />
    ) : (
      user?.name ? user.name.charAt(0).toUpperCase() : "U"
    )}
  </div>

  <label className="camera-btn">
    📷
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={handleImageChange}
    />
  </label>
</div>
          <h1>My Profile</h1>

    <div className="profile-info">
      <div className="info-row">
        <span>Name</span>
        <strong>{user?.name}</strong>
      </div>

      <div className="info-row">
        <span>Email</span>
        <strong>{user?.email}</strong>
      </div>

      <div className="info-row">
        <span>Role</span>
        <strong>{user?.role}</strong>
      </div>
    </div>

    {role !== "admin" && (
      <button
        className="edit-profile-btn"
        onClick={() => setIsEditing(true)}
      >
        ✎ Edit Profile
      </button>
    )}
  </div>

 {isEditing && (
  <div className="modal-overlay">
    <div className="edit-profile-modal">
      <input
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={editEmail}
        onChange={(e) => setEditEmail(e.target.value)}
        placeholder="Email"
      />
<div className="modal-buttons">
  <button className="main-btn" onClick={handleUpdateProfile}>
    Save Changes
  </button>

  <button
    className="cancel-btn"
    onClick={() => setIsEditing(false)}
  >
    Cancel
  </button>
</div>
    </div>
  </div>
  
  )}

  {role === "parent" && (
    <div className="bookings-card">
      <div className="bookings-header">
        <h2>📅 My Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-box">
          <div className="empty-icon">📅</div>
          <h3>No bookings yet</h3>
          <p>Start exploring centers and book your first course.</p>
          <a className="main-btn" href="/search">Find Centers</a>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
            marginTop: "10px",
          }}
        >
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                background: "#f8faff",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid #d6e6f5",
              }}
            >
              <h3 style={{ color: "#3b5b7a", marginBottom: "8px" }}>
                {booking.course_name}
              </h3>
              <p>🏫 <strong>Center:</strong> {booking.center_name}</p>
              <p>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p>🔄 <strong>Status:</strong> {booking.status}</p>

              <button
                onClick={() => handleCancelBooking(booking.id)}
                style={{
                  marginTop: "10px",
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                ❌ Cancel Booking
              </button>
            </div>
            
          ))}
        </div>
      )}
    </div>
  )}

        {role === "center" && (
          <>
            {centerBookings.length > 0 && (
              <div style={{background: '#fff3e0', padding: '12px 20px', borderRadius: '12px', border: '2px solid #ffb74d', gridColumn: 'span 3', marginBottom: '10px'}}>
                🔔 <strong>You have {centerBookings.length} new booking(s)!</strong>
              </div>
            )}

            <div className="clean-card">
              <h2>🏫 Center Info</h2>
              {centerData ? (
                <>
                  <p><strong>Name:</strong> {centerData.name}</p>
                  <p><strong>Location:</strong> {centerData.location}</p>
                  <p><strong>Description:</strong> {centerData.description}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{color: centerData.approved ? 'green' : 'orange'}}>
                      {centerData.approved ? "Approved ✅" : "Pending Approval ⏳"}
                    </span>
                  </p>
                  <a className="main-link" href="/dashboard" style={{marginTop: '10px', display: 'inline-block'}}>
                    ⚙️ Manage Center
                  </a>
                </>
              ) : (
                <p style={{color: '#94a3b8'}}>No center registered yet.</p>
              )}
            </div>

            <div className="clean-card">
              <h2>📚 My Courses</h2>
              {centerCourses.length === 0 ? (
                <p style={{color: '#94a3b8'}}>No courses yet.</p>
              ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '10px'}}>
                  {centerCourses.map(course => (
                    <div key={course.id} style={{background: '#f8faff', borderRadius: '16px', padding: '16px', border: '1px solid #d6e6f5'}}>
                      <h3 style={{color: '#3b5b7a'}}>{course.title || course.name}</h3>
                      <p>💰 {course.price} SAR</p>
                      <p>⏱️ {course.duration}</p>
                      <p>📅 {course.days}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="clean-card">
              <h2>📅 Center Bookings</h2>
              {centerBookings.length === 0 ? (
                <p style={{color: '#94a3b8'}}>No bookings yet.</p>
              ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginTop: '10px'}}>
                  {centerBookings.map((booking) => (
                    <div key={booking.id} style={{background: '#f8faff', borderRadius: '16px', padding: '16px', border: '1px solid #d6e6f5'}}>
                      <h3 style={{color: '#3b5b7a'}}>{booking.course_name}</h3>
                      <p>👤 <strong>Student:</strong> {booking.email}</p>
                      <p>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p>🔄 <strong>Status:</strong> {booking.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <div className="clean-card stat-card">
              <h2>👥 Users</h2>
              <h1>{users.length}</h1>
            </div>
            <div className="clean-card stat-card">
              <h2>🏫 Centers</h2>
              <h1>{centers.length}</h1>
            </div>
            <div className="clean-card stat-card">
              <h2>⏳ Pending</h2>
              <h1>{centers.filter(c => !c.approved).length}</h1>
              <a className="main-link" href="/dashboard">Admin Dashboard</a>
            </div>
          </>
        )}

      </section>
    </div>
  );
}

export default Profile;
