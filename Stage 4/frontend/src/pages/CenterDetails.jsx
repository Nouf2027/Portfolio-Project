import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import API from "../api/axios";

function CenterDetails() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  useEffect(() => {
    API.get(`/centers/${id}`)
      .then(res => { setCenter(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    API.get(`/reviews/center/${id}`)
      .then(res => setReviews(res.data.reviews))
      .catch(() => {});
    API.get(`/centers/${id}/courses`)
      .then(res => setCourses(res.data))
      .catch(() => {});
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/reviews', { centre_id: id, rating, comment });
      setReviews([...reviews, res.data]);
      setSuccess('Review added successfully!');
      setComment('');
    } catch (err) {
      setError('Failed to add review. Please login first.');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        course_id: selectedCourse.id,
        center_id: id,
        date: bookingDate
      });
      setBookingSuccess('Booking successful! ✅');
      setBookingDate('');
      setTimeout(() => {
        setSelectedCourse(null);
        setBookingSuccess('');
      }, 2000);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!center) return <h1>Center not found</h1>;

  return (
    <div className="details-page">

      {/* Popup */}
      {selectedCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '30px',
            width: '400px', maxWidth: '90%', position: 'relative'
          }}>
            <button onClick={() => setSelectedCourse(null)} style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'
            }}>✕</button>

            <h2 style={{color: '#3b5b7a', marginBottom: '15px'}}>📚 {selectedCourse.name}</h2>
            <p>💰 <strong>Price:</strong> {selectedCourse.price} SAR</p>
            <p>⏱️ <strong>Duration:</strong> {selectedCourse.duration}</p>
            <p>📅 <strong>Days:</strong> {selectedCourse.days}</p>
            <p>🕐 <strong>Time:</strong> {selectedCourse.times}</p>
            {selectedCourse.instructor && <p>👨‍🏫 <strong>Instructor:</strong> {selectedCourse.instructor}</p>}
            {selectedCourse.description && <p>📝 {selectedCourse.description}</p>}

            <hr style={{margin: '15px 0'}} />

            {bookingSuccess ? (
              <p style={{color: 'green', textAlign: 'center', fontSize: '18px'}}>{bookingSuccess}</p>
            ) : (
              <form onSubmit={handleBooking}>
                <label><strong>Select Date:</strong></label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  style={{width: '100%', padding: '10px', margin: '10px 0', borderRadius: '10px', border: '2px solid #ffe082'}}
                />
                {bookingError && <p style={{color: 'red'}}>{bookingError}</p>}
                <button type="submit" style={{width: '100%'}}>Confirm Booking ✅</button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="details-card">
        <h1>{center.name}</h1>
        <p>{center.location}</p>
        <p>{center.description}</p>
      </div>

      <div className="courses-section">
        <h2>📚 Available Courses</h2>
        {courses.length === 0 ? (
          <p>No courses available yet.</p>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p>💰 {course.price} SAR</p>
                <p>⏱️ {course.duration}</p>
                <p>📅 {course.days}</p>
                {role === 'parent' && (
                  <button onClick={() => setSelectedCourse(course)}>
                    View Details & Book
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} style={{background: '#fff9c4', padding: '10px', borderRadius: '10px', marginBottom: '10px'}}>
              <p><strong>{review.user_name}</strong></p>
              <p>⭐ {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
        {role === 'parent' && (
          <>
            <h3>Add a Review</h3>
            {success && <p style={{color: 'green'}}>{success}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleReview}>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">5 ⭐</option>
                <option value="4">4 ⭐</option>
                <option value="3">3 ⭐</option>
                <option value="2">2 ⭐</option>
                <option value="1">1 ⭐</option>
              </select>
              <textarea placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit">Submit Review</button>
            </form>
          </>
        )}
        {role === 'admin' && <p style={{color: '#ff6f00', fontWeight: 'bold'}}>⚠️ Admins cannot add reviews</p>}
        {role === 'center' && <p style={{color: '#ff6f00', fontWeight: 'bold'}}>⚠️ Centers cannot add reviews</p>}
      </div>
    </div>
  );
}

export default CenterDetails;
