import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import API from "../api/axios";
import {
  FiBookOpen, FiDollarSign, FiClock, FiCalendar,
  FiUser, FiStar, FiMapPin, FiFileText, FiX, FiCheckCircle
} from "react-icons/fi";

function CenterDetails() {
  const { id } = useParams();
  const [center, setCenter]           = useState(null);
  const [reviews, setReviews]         = useState([]);
  const [courses, setCourses]         = useState([]);
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState('');
  const [loading, setLoading]         = useState(true);
  const [success, setSuccess]         = useState('');
  const [error, setError]             = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError]     = useState('');
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
      setSuccess('تمت إضافة التقييم بنجاح');
      setComment('');
    } catch {
      setError('فشل إضافة التقييم، الرجاء تسجيل الدخول أولًا');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { course_id: selectedCourse.id, center_id: id });
      setBookingSuccess('تم الحجز بنجاح! سيتواصل معك المركز قريباً.');
      setTimeout(() => { setSelectedCourse(null); setBookingSuccess(''); }, 2500);
    } catch {
      setBookingError('فشل الحجز، الرجاء المحاولة مرة أخرى');
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!center) return <h1 style={{textAlign:'center',marginTop:'60px'}}>لم يتم العثور على المركز</h1>;

  return (
    <div className="cd-details-page" dir="rtl">

      {/* ══ Modal الحجز ══ */}
      {selectedCourse && (
        <div className="cd-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="cd-booking-modal" onClick={e => e.stopPropagation()}>

            {/* زر الإغلاق */}
            <button className="cd-modal-close" onClick={() => setSelectedCourse(null)}>
              <FiX />
            </button>

            <h2 className="cd-modal-title">
              <FiBookOpen /> {selectedCourse.name}
            </h2>

            <div className="cd-modal-info">
              <div className="cd-modal-row"><FiDollarSign /><span><strong>السعر:</strong> {selectedCourse.price} ريال</span></div>
              <div className="cd-modal-row"><FiClock /><span><strong>المدة:</strong> {selectedCourse.duration}</span></div>
              <div className="cd-modal-row"><FiCalendar /><span><strong>التاريخ:</strong> {selectedCourse.days}</span></div>
              <div className="cd-modal-row"><FiClock /><span><strong>الوقت:</strong> {selectedCourse.times}</span></div>
              {selectedCourse.instructor && (
                <div className="cd-modal-row"><FiUser /><span><strong>المدرب:</strong> {selectedCourse.instructor}</span></div>
              )}
            </div>

            <hr className="cd-modal-divider" />

            {bookingSuccess ? (
              <div className="cd-booking-success">
                <FiCheckCircle /> {bookingSuccess}
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                {bookingError && <p className="cd-booking-error">{bookingError}</p>}
                <button type="submit" className="cd-confirm-btn">تأكيد الحجز</button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="cd-details-wrap">

        {/* ══ بطاقة المركز ══ */}
        <div className="cd-center-hero">
          <div className="cd-center-img-wrap">
            {center.image
              ? <img src={center.image} alt={center.name} className="cd-center-img" onError={e => e.target.style.display='none'} />
              : <div className="cd-center-img-placeholder"><FiBookOpen /></div>
            }
          </div>
          <div className="cd-center-body">
            <h1 className="cd-center-name">{center.name}</h1>
            <p className="cd-center-loc"><FiMapPin /> {center.location}</p>
            <p className="cd-center-desc">{center.description}</p>
          </div>
          <div className="cd-center-stats">
            <div className="cd-stat-row"><FiStar /><span><strong>التقييم:</strong> {reviews.length > 0 ? `${center.average_rating}/5` : 'لا توجد تقييمات'}</span></div>
            <div className="cd-stat-row"><FiFileText /><span><strong>عدد التقييمات:</strong> {reviews.length}</span></div>
            <div className="cd-stat-row"><FiBookOpen /><span><strong>عدد الدورات:</strong> {courses.length}</span></div>
          </div>
        </div>

        {/* ══ الدورات ══ */}
        <h2 className="cd-section-title"><FiBookOpen /> الدورات المتاحة</h2>
        {courses.length === 0
          ? <p className="cd-empty-msg">لا توجد دورات متاحة حالياً.</p>
          : (
            <div className="cd-courses-grid">
              {courses.map(course => (
                <div key={course.id} className="cd-course-card">
                  <h3 className="cd-course-name">{course.name}</h3>
                  <div className="cd-course-info">
                    <span><FiDollarSign /> {course.price} ريال</span>
                    <span><FiClock /> {course.duration}</span>
                    <span><FiCalendar /> {course.days}</span>
                    {course.times && <span><FiClock /> {course.times}</span>}
                    {course.instructor && <span><FiUser /> {course.instructor}</span>}
                  </div>
                  {role === 'parent' && (
                    <button className="cd-book-btn" onClick={() => { setBookingError(''); setSelectedCourse(course); }}>
                      احجز الآن
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        }

        {/* ══ التقييمات ══ */}
        <h2 className="cd-section-title"><FiStar /> التقييمات</h2>
        {reviews.length === 0
          ? <p className="cd-empty-msg">لا توجد تقييمات حتى الآن.</p>
          : (
            <div className="cd-reviews-grid">
              {reviews.map((review, i) => (
                <div key={i} className="cd-review-card">
                  <p className="cd-review-author">{review.user_name}</p>
                  <p className="cd-review-rating"><FiStar /> {review.rating}/5</p>
                  <p className="cd-review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )
        }

        {/* ══ إضافة تقييم ══ */}
        {role === 'parent' && (
          <div className="cd-review-form-wrap">
            <h3>إضافة تقييم</h3>
            {success && <p className="cd-success-msg">{success}</p>}
            {error   && <p className="cd-error-msg">{error}</p>}
            <form onSubmit={handleReview} className="cd-review-form">
              <select value={rating} onChange={e => setRating(e.target.value)} className="cd-select-input">
                <option value="5">5 نجوم ⭐⭐⭐⭐⭐</option>
                <option value="4">4 نجوم ⭐⭐⭐⭐</option>
                <option value="3">3 نجوم ⭐⭐⭐</option>
                <option value="2">نجمتان ⭐⭐</option>
                <option value="1">نجمة واحدة ⭐</option>
              </select>
              <textarea placeholder="اكتب تقييمك..." value={comment} onChange={e => setComment(e.target.value)} className="cd-textarea-input" rows={3} />
              <button type="submit" className="cd-confirm-btn">إرسال التقييم</button>
            </form>
          </div>
        )}
        {role === 'admin'  && <p className="cd-role-note">لا يمكن للمشرفين إضافة تقييمات</p>}
        {role === 'center' && <p className="cd-role-note">لا يمكن للمراكز إضافة تقييمات</p>}
      </div>
    </div>
  );
}

export default CenterDetails;
