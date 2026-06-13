import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Booking() {
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // تحقق من تسجيل الدخول
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    API.get('/courses').then(res => setCourses(res.data)).catch(() => setCourses([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { course_id: courseId, date });
      setSuccess('تم الحجز بنجاح!');
      setError('');
    } catch (err) {
      setError('فشل الحجز، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="booking-page" dir="rtl">
      <h1>حجز دورة</h1>
      <p>يرجى اختيار الدورة وتحديد تاريخ الحجز المناسب.</p>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
      {success && <p>سيتلقى المركز طلب حجزك قريباً.</p>}
      <form className="form-container" onSubmit={handleSubmit}>
        <label>تاريخ الحجز</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>الدورات المتاحة</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">اختر الدورة</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} - {course.price} ريال - {course.duration} - {course.days}
            </option>
          ))}
        </select>
        <button type="submit">تأكيد الحجز</button>
      </form>
    </div>
  );
}

export default Booking;
