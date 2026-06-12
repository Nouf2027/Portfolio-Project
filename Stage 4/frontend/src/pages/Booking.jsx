import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function Booking() {
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get('/courses').then(res => setCourses(res.data)).catch(() => setCourses([]));
  }, []);

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
      <p>Please select a course and choose a suitable booking date.</p>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
      {success && <p>The center will receive your booking request.</p>}
      <form className="form-container" onSubmit={handleSubmit}>
        <input type="text" placeholder="Child Name" value={childName} onChange={(e) => setChildName(e.target.value)} />
        <input type="text" placeholder="Parent Name" value={parentName} onChange={(e) => setParentName(e.target.value)} />
        <label>Select Booking Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label>Available Courses</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">اختاري الكورس</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} - {course.price} ريال - {course.duration} - {course.days}
            </option>
          ))}
        </select>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

export default Booking;
