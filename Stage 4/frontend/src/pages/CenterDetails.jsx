import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function CenterDetails() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  useEffect(() => {
    // زيادة المشاهدات
    API.patch(`/centers/${id}/view`).catch(() => {});

    API.get(`/centers/${id}`)
      .then(res => {
        setCenter(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    API.get(`/reviews/center/${id}`)
      .then(res => setReviews(res.data.reviews))
      .catch(err => console.error(err));
  }, [id]);

  const handleReview = async (e) => {
  e.preventDefault();
  try {
    await API.post('/reviews', { centre_id: id, rating, comment });
    setSuccess('تمت إضافة التقييم بنجاح');
    setComment('');
  } catch (err) {
    setError('فشل إضافة التقييم، الرجاء تسجيل الدخول أولًا');
  }
};

if (loading) return <p>جاري التحميل...</p>;
if (!center) return <h1>لم يتم العثور على المركز</h1>;

  return (
  <div className="details-page">
    <div className="details-card">
      <h1>{center.name}</h1>
      <p>{center.location}</p>
      <p>{center.description}</p>

      {role !== 'admin' && role !== 'center' && (
        <Link to="/booking">
          <button>احجز الآن</button>
        </Link>
      )}
    </div>

    <div className="reviews-section">
      <h2>التقييمات</h2>

      {reviews.length === 0 ? (
        <p>لا توجد تقييمات حتى الآن.</p>
      ) : (
        reviews.map((review, index) => (
          <div
            key={index}
            style={{
              background: '#fff9c4',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '10px'
            }}
          >
            <p>⭐ {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}

       {role === 'parent' && (
  <>
    <h3>إضافة تقييم</h3>
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

      <textarea
        placeholder="اكتب تقييمك..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit">إرسال التقييم</button>
    </form>
  </>
)}

{role === 'admin' && (
  <p style={{color: '#ff6f00', fontWeight: 'bold'}}>
    لا يمكن للمشرفين إضافة تقييمات
  </p>
)}

{role === 'center' && (
  <p style={{color: '#ff6f00', fontWeight: 'bold'}}>
    لا يمكن للمراكز إضافة تقييمات
  </p>
)}
    
      </div>
    </div>
  );
}

export default CenterDetails;
