import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const [bookings, setBookings] = useState([]);
  const [centerData, setCenterData] = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);

  useEffect(() => {
    if (role === 'parent') {
      API.get('/bookings/me').then(res => setBookings(res.data)).catch(() => {});
    }
    if (role === 'center') {
      API.get('/centers/mine').then(res => setCenterData(res.data)).catch(() => {});
      API.get('/bookings/center').then(res => setCenterBookings(res.data)).catch(() => {});
    }
  }, [role]);

  const handleCancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>
        <div className="profile-info">
          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
          {role !== 'admin' && (
            <div className="profile-buttons">
              <button>Edit Profile</button>
              <button>Delete Account</button>
            </div>
          )}
        </div>
      </div>

      {role === 'parent' && (
        <div className="profile-card bookings-section">
          <div className="bookings-header">
            <h2>My Bookings</h2>
            <span>{bookings.length} booking(s)</span>
          </div>
          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <p>☘️ No bookings yet</p>
              <p>Start exploring centers and book your first course.</p>
              <a href="/search">Find Centers</a>
            </div>
          ) : (
            bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <h3>{booking.course_name}</h3>
                <p><strong>Center:</strong> {booking.center_name}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> {booking.price} SAR</p>
                <p><strong>Duration:</strong> {booking.duration}</p>
                <p><strong>Days:</strong> {booking.days}</p>
                <p><strong>Times:</strong> {booking.times}</p>
                <p className="status">{booking.status}</p>
                <button onClick={() => handleCancelBooking(booking.id)} style={{backgroundColor:'red', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', marginTop:'10px'}}>
                  ❌ Cancel Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {role === 'center' && (
        <div className="profile-card">
          <h2>🏫 Center Information</h2>
          {centerData ? (
            <div>
              <p><strong>Name:</strong> {centerData.name}</p>
              <p><strong>Location:</strong> {centerData.location}</p>
              <p><strong>Description:</strong> {centerData.description}</p>
              <p><strong>Status:</strong> {centerData.approved ? "Approved ✅" : "Pending ⏳"}</p>
            </div>
          ) : (
            <p>No center registered yet. <a href="/dashboard">Register your center</a></p>
          )}
          <h2 style={{marginTop:'20px'}}>📅 Center Bookings</h2>
          {centerBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            centerBookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <h3>{booking.course_name}</h3>
                <p><strong>Center:</strong> {booking.center_name}</p>
                <p><strong>Student:</strong> {booking.email}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p className="status">{booking.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
