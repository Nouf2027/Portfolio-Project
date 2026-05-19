import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  useEffect(() => {
    API.get(`/centers/${id}`)
      .then(res => { setCenter(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    API.get(`/reviews/center/${id}`)
      .then(res => setReviews(res.data.reviews))
      .catch(() => {});
    API.get(`/courses?center_id=${id}`)
      .then(res => setCourses(res.data))
      .catch(() => {});
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', { centre_id: id, rating, comment });
      setSuccess('Review added successfully!');
      setComment('');
    } catch (err) {
      setError('Failed to add review. Please login first.');
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!center) return <h1>Center not found</h1>;

  return (
    <div className="details-page">
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
                  <Link to={`/courses/${course.id}`}>
                    <button>View Details & Book</button>
                  </Link>
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
