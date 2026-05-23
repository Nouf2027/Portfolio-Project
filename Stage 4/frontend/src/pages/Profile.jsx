
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

  return (
    <div className="modern-profile-page">

      <aside className="profile-sidebar">
        <h2>☘️ Jeel</h2>
        <a href="/profile" className="active">🏠 Overview</a>
        <a href="/search">🏫 Centers</a>
        <a href="/dashboard">📊 Dashboard</a>
        <a href="/profile">⚙️ Settings</a>
        <a href="/login">🚪 Logout</a>
      </aside>

      <main className="profile-main">

        <section className="hero-profile">
          <div>
            <h1>Welcome back, {user?.name} 👋</h1>
            <p>Here’s what’s happening with your account today.</p>

            <div className="hero-tags">
              <span>✉️ {user?.email}</span>
              <span className={`role-pill ${role}`}>{role}</span>
            </div>
          </div>

          <div className="hero-avatar">
            👤
          </div>
        </section>

        <section className="dashboard-grid">

          <div className="modern-card">
            <h2>👤 My Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            {role !== "admin" && (
              <div className="card-actions">
                <button>Edit Profile</button>
                <button className="danger-btn">Delete Account</button>
              </div>
            )}
          </div>

          {role === "parent" && (
            <>
              <div className="modern-card">
                <h2>📚 My Bookings</h2>
                <div className="stat-box">{bookings.length} booking(s)</div>

                {bookings.length === 0 ? (
                  <div className="empty-modern">
                    <h3>No bookings yet</h3>
                    <p>Start exploring centers and book your first course.</p>
                    <a href="/search">Find Centers</a>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div className="booking-card" key={booking.id}>
                      <h3>{booking.course_name}</h3>
                      <p>{booking.center_name}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="modern-card">
                <h2>⭐ Recommended Centers</h2>
                <div className="empty-modern">
                  <p>Explore learning centers for your child.</p>
                  <a href="/search">Browse Centers</a>
                </div>
              </div>
            </>
          )}

          {role === "center" && (
            <>
              <div className="modern-card">
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
                  <div className="empty-modern">
                    <h3>No center registered yet</h3>
                    <p>Register your center to start adding courses.</p>
                    <a href="/dashboard">Register your center</a>
                  </div>
                )}
              </div>

              <div className="modern-card">
                <h2>📅 Center Bookings</h2>
                <div className="stat-box">{centerBookings.length} booking(s)</div>

                {centerBookings.length === 0 ? (
                  <div className="empty-modern">
                    <h3>No bookings yet</h3>
                    <p>Bookings will appear here when parents book your courses.</p>
                  </div>
                ) : (
                  centerBookings.map((booking) => (
                    <div className="booking-card" key={booking.id}>
                      <h3>{booking.course_name}</h3>
                      <p><strong>Student:</strong> {booking.email}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="modern-card">
                <h2>⚡ Quick Actions</h2>
                <div className="quick-actions">
                  <a href="/dashboard">➕ Add Course</a>
                  <a href="/dashboard">📋 View Bookings</a>
                  <a href="/dashboard">⚙️ Manage Center</a>
                </div>
              </div>
            </>
          )}

          {role === "admin" && (
            <>
              <div className="modern-card">
                <h2>👥 Total Users</h2>
                <div className="big-number">{users.length}</div>
              </div>

              <div className="modern-card">
                <h2>🏫 Total Centers</h2>
                <div className="big-number">{centers.length}</div>
              </div>

              <div className="modern-card">
                <h2>⏳ Pending Centers</h2>
                <div className="big-number">
                  {centers.filter(center => !center.approved).length}
                </div>
                <a className="main-link" href="/dashboard">Go to Admin Dashboard</a>
              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}

export default Profile;