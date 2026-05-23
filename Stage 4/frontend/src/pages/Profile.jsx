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
    <div className="clean-profile-page">

      <section className="profile-hero">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Manage your account and activities in Jeel.</p>

          <div className="profile-tags">
            <span>✉️ {user?.email}</span>
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
          <div className="clean-card">
            <h2>📚 My Bookings</h2>

            {bookings.length === 0 ? (
              <div className="empty-box">
                <h3>No bookings yet</h3>
                <p>Start exploring centers and book your first course.</p>
                <a href="/search">Find Centers</a>
              </div>
            ) : (
              bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <h3>{booking.course_name}</h3>
                  <p><strong>Center:</strong> {booking.center_name}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                </div>
              ))
            )}
          </div>
        )}

        {role === "center" && (
          <>
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
                centerBookings.map((booking) => (
                  <div className="booking-card" key={booking.id}>
                    <h3>{booking.course_name}</h3>
                    <p><strong>Student:</strong> {booking.email}</p>
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                ))
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