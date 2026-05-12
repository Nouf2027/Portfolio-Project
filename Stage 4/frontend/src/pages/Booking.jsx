import React, { useState } from 'react';
import API from '../api/axios';

function Booking() {
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { course_id: courseId, date });
      setSuccess('Booking successful!');
      setError('');
    } catch (err) {
      setError('Booking failed. Please try again.');
    }
  };

  return (
    <div className="booking-page">
      <h1>Book a Center</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Child Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Parent Name"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;
