import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [bookings, setBookings] = useState([]);
  const [centerData, setCenterData] = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    if (role === "parent") {
      API.get("/bookings/me").then(res => setBookings(res.data)).catch(() => {});
    }
    if (role === "center") {
      API.get("/centers/mine").then(res => setCenterData(res.data)).catch(() => {});
      API.get("/bookings/center").then(res => setCenterBookings(res.data)).catch(() => {});
    }
    if (role === "admin") {
      API.get("/auth/users").then(res => setUsers(res.data)).catch(() => {});
      API.get("/centers").then(res => setCenters(res.data)).catch(() => {});
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

  return (
    <div className="clean-profile-page">
      <section className="profile-hero">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Manage your account and activities in Jeel.</p>
          <div className="profile-tags">
            <span>✉️ {user?.email}</span>
            <span> </span>
            <span className={`role-pill ${role}`}>{role}</span>
          </div>
        </div>
      </section>

      <section className="clean-profile-grid">
        <div className="clean-card">
          <h2>👤 My Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          {role !== "admin" && (
            <button className="main-btn">Edit Profile</button>
          )}
        </div>

        {role === "parent" && (
          <div className="clean-card" style={{gridColumn: 'span 2'}}>
            <h2>📚 My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty-box">
                <h3>No bookings yet</h3>
                <p>Start exploring centers and book your first course.</p>
                <a href="/search">Find Centers</a>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '10px'}}>
                {bookings.map((booking) => (
                  <div className="booking-card" key={booking.id} style={{background: '#f8faff', borderRadius: '16px', padding: '16px', border: '1px solid #d6e6f5'}}>
                    <h3 style={{color: '#3b5b7a', marginBottom: '8px'}}>{booking.course_name}</h3>
                    <p>🏫 <strong>Center:</strong> {booking.center_name}</p>
                    <p>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p>🔄 <strong>Status:</strong> {booking.status}</p>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      style={{marginTop: '10px', background: '#ff4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', width: '100%'}}
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
              <div style={{background: '#fff3e0', padding: '12px 20px', borderRadius: '12px', border: '2px solid #ffb74d', marginBottom: '10px', gridColumn: 'span 3'}}>
                🔔 <strong>You have {centerBookings.length} new booking(s)!</strong>
              </div>
            )}
            <div className="clean-card">
              <h2>🏫 Center Profile</h2>
              {centerData ? (
                <>
                  <p><strong>Center Name:</strong> {centerData.name}</p>
                  <p><strong>Location:</strong> {centerData.location}</p>
                  <p><strong>Description:</strong> {centerData.description}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={centerData.approved ? "approved-status" : "pending-status"}>
                      {centerData.approved ? "Approved ✅" : "Pending Approval ⏳"}
                    </span>
                  </p>
                  <a className="main-link" href="/dashboard">Manage Center</a>
                </>
              ) : (
                <div className="empty-box">
                  <h3>No center registered yet</h3>
                  <p>Register your center to start adding courses.</p>
                  <a href="/dashboard">Register your center</a>
                </div>
              )}
            </div>

            <div className="clean-card">
              <h2>📅 Center Bookings</h2>
              {centerBookings.length === 0 ? (
                <div className="empty-box">
                  <h3>No bookings yet</h3>
                  <p>Bookings will appear here when parents book your courses.</p>
                </div>
              ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginTop: '10px'}}>
                  {centerBookings.map((booking) => (
                    <div className="booking-card" key={booking.id} style={{background: '#f8faff', borderRadius: '16px', padding: '16px', border: '1px solid #d6e6f5'}}>
                      <h3 style={{color: '#3b5b7a'}}>{booking.course_name}</h3>
                      <p>👤 <strong>Student:</strong> {booking.email}</p>
                      <p>📅 <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
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
              <h2>⏳ Pending Centers</h2>
              <h1>{centers.filter(center => !center.approved).length}</h1>
              <a className="main-link" href="/dashboard">Admin Dashboard</a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Profile;
