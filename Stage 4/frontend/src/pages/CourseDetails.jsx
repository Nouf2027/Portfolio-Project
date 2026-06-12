import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(() => {});
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { course_id: id, date });
      setSuccess('✅ تم الحجز بنجاح!');
      setError('');
    } catch (err) {
      setError('فشل الحجز، حاول مرة ثانية');
    }
  };

  if (!course) return <div className="loading">جاري التحميل...</div>;

  return (
    <div className="course-details-page">
      <div className="course-details-card">
        <h1>{course.name}</h1>
        <div className="course-info">
          <p><strong>👨‍🏫 المدرب:</strong> {course.instructor}</p>
          <p><strong>💰 السعر:</strong> {course.price} SAR</p>
          <p><strong>⏱️ المدة:</strong> {course.duration}</p>
          <p><strong>📅 الأيام:</strong> {course.days}</p>
          <p><strong>🕐 الأوقات:</strong> {course.times}</p>
          <p><strong>👶 الفئة العمرية:</strong> {course.age_range}</p>
          <p><strong>📝 عن الكورس:</strong> {course.description}</p>
        </div>

        <div className="booking-section">
          <h2>احجز الآن</h2>
          {success && <p style={{color:'green', fontSize:'18px'}}>{success}</p>}
          {error && <p style={{color:'red'}}>{error}</p>}
          {!success && (
            <form onSubmit={handleBooking} className="form-container">
              <label>اختاري تاريخ الحجز</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <button type="submit">Book Now 🎯</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
