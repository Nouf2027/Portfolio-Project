import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
  fetchBookings();
}, []);

const fetchBookings = async () => {
  try {
    const res = await API.get('/bookings/me');
    setBookings(res.data);
  } catch (err) {
    console.log(err);
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

  <div className="profile-buttons">
    <button>Edit Profile</button>
    <button>Delete Account</button>
  </div>

</div>
      </div>

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
        <h3>{booking.centerName}</h3>
        <p><strong>Course:</strong> {booking.courseName}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Price:</strong> {booking.price} SAR</p>
        <p className="status">{booking.status}</p>
      </div>
    ))
  )}
</div>
    </div>
  );
}

export default Profile;