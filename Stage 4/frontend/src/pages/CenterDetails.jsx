import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import {
  FiBookOpen, FiDollarSign, FiClock, FiCalendar,
  FiUser, FiStar, FiMapPin, FiFileText, FiX, FiCheckCircle
} from "react-icons/fi";

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
      setSuccess('تمت إضافة التقييم بنجاح');
      setComment('');
    } catch (err) {
      setError('فشل إضافة التقييم، الرجاء تسجيل الدخول أولًا');
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
      setBookingSuccess('تم الحجز بنجاح');
      setBookingDate('');
      setTimeout(() => {
        setSelectedCourse(null);
        setBookingSuccess('');
      }, 2000);
    } catch (err) {
      setBookingError('فشل الحجز، الرجاء المحاولة مرة أخرى');
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!center) return <h1>لم يتم العثور على المركز</h1>;

  return (
    <div className="details-page" dir="rtl">
      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '30px 20px'}}>

        {/* نافذة حجز الدورة */}
        {selectedCourse && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background:'white', borderRadius:'20px', padding:'30px', width:'400px', maxWidth:'90%', position:'relative'}}>
              <button onClick={() => setSelectedCourse(null)} style={{position:'absolute', top:'15px', left:'15px', background:'none', border:'none', fontSize:'20px', cursor:'pointer', display:'flex'}}><FiX /></button>
              <h2 style={{color:'#3b5b7a', marginBottom:'15px', display:'flex', alignItems:'center', gap:'8px'}}><FiBookOpen /> {selectedCourse.name || selectedCourse.title}</h2>
              <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiDollarSign /> <strong>السعر:</strong> {selectedCourse.price} ريال</p>
              <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiClock /> <strong>المدة:</strong> {selectedCourse.duration}</p>
              <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiCalendar /> <strong>التاريخ:</strong> {selectedCourse.days}</p>
              <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiClock /> <strong>الوقت:</strong> {selectedCourse.times}</p>
              {selectedCourse.instructor && <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiUser /> <strong>المدرب:</strong> {selectedCourse.instructor}</p>}
              <hr style={{margin:'15px 0'}} />
              {bookingSuccess ? (
                <p style={{color:'green', textAlign:'center', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}><FiCheckCircle /> {bookingSuccess}</p>
              ) : (
                <form onSubmit={handleBooking}>
                  <label><strong>اختر التاريخ:</strong></label>
                  <input type="date" value={bookingDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingDate(e.target.value)} required
                    style={{width:'100%', padding:'10px', margin:'10px 0', borderRadius:'10px', border:'2px solid #ffe082'}}/>
                  {bookingError && <p style={{color:'red'}}>{bookingError}</p>}
                  <button type="submit" style={{width:'100%'}}>تأكيد الحجز</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* معلومات المركز */}
        <div style={{background:'white', borderRadius:'20px', padding:'30px', marginBottom:'30px', border:'1px solid #d6e6f5', display:'flex', gap:'30px', flexWrap:'wrap'}}>
          <div style={{flex:1, minWidth:'250px'}}>
            <img
              src={center.image || "/default-center.jpg"}
              alt={center.name}
              style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "18px" }}
            />
          </div>
          <div style={{flex:1, minWidth:'250px'}}>
            <h1 style={{color:'#3b5b7a', marginBottom:'10px'}}>{center.name}</h1>
            <p style={{color:'#64748b', display:'flex', alignItems:'center', gap:'6px'}}><FiMapPin /> {center.location}</p>
            <p style={{color:'#475569', marginTop:'10px', lineHeight:'1.8'}}>{center.description}</p>
          </div>
          <div style={{flex:1, minWidth:'250px', background:'#f8faff', borderRadius:'16px', padding:'20px'}}>
            <p style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <FiStar /> <strong>التقييم:</strong>{" "}
              {reviews.length > 0 ? `${center.average_rating}/5` : "لا توجد تقييمات بعد"}
            </p>
            <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiFileText /> <strong>عدد التقييمات:</strong> {reviews.length}</p>
            <p style={{display:'flex', alignItems:'center', gap:'8px'}}><FiBookOpen /> <strong>عدد الدورات:</strong> {courses.length}</p>
          </div>
        </div>

        {/* الدورات */}
        <h2 style={{color:'#3b5b7a', marginBottom:'15px', display:'flex', alignItems:'center', gap:'8px'}}><FiBookOpen /> الدورات المتاحة</h2>
        {courses.length === 0 ? (
          <p style={{color:'#94a3b8'}}>لا توجد دورات متاحة حالياً.</p>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px', marginBottom:'30px'}}>
            {courses.map(course => (
              <div key={course.id} style={{background:'white', borderRadius:'16px', padding:'20px', border:'2px solid #ffe082', boxShadow:'0 4px 15px rgba(0,0,0,0.06)'}}>
                <h3 style={{color:'#e65100', marginBottom:'10px'}}>{course.name || course.title}</h3>
                <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiDollarSign /> {course.price} ريال</p>
                <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiClock /> {course.duration}</p>
                <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiCalendar /> {course.days}</p>
                {course.times && <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiClock /> {course.times}</p>}
                {course.instructor && <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiUser /> {course.instructor}</p>}
                {role === 'parent' && (
                  <button onClick={() => setSelectedCourse(course)} style={{marginTop:'10px', width:'100%'}}>
                    عرض التفاصيل والحجز
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* التقييمات */}
        <h2 style={{color:'#3b5b7a', marginBottom:'15px', display:'flex', alignItems:'center', gap:'8px'}}><FiStar /> التقييمات</h2>
        {reviews.length === 0 ? (
          <p style={{color:'#94a3b8'}}>لا توجد تقييمات حتى الآن.</p>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'16px', marginBottom:'20px'}}>
            {reviews.map((review, index) => (
              <div key={index} style={{background:'#fff9c4', padding:'16px', borderRadius:'16px', border:'1px solid #ffe082'}}>
                <p><strong>{review.user_name}</strong></p>
                <p style={{display:'flex', alignItems:'center', gap:'6px'}}><FiStar /> {review.rating}/5</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* فورم إضافة تقييم */}
        {role === 'parent' && (
          <div style={{background:'white', borderRadius:'20px', padding:'20px', border:'1px solid #d6e6f5', marginTop:'20px'}}>
            <h3 style={{color:'#3b5b7a', marginBottom:'15px'}}>إضافة تقييم</h3>
            {success && <p style={{color:'green'}}>{success}</p>}
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleReview}>
              <select value={rating} onChange={(e) => setRating(e.target.value)} style={{padding:'10px', borderRadius:'10px', border:'2px solid #ffe082', marginBottom:'10px', width:'100%'}}>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">نجمتان</option>
                <option value="1">نجمة واحدة</option>
              </select>
              <textarea placeholder="اكتب تقييمك..." value={comment} onChange={(e) => setComment(e.target.value)}
                style={{width:'100%', padding:'10px', borderRadius:'10px', border:'2px solid #ffe082', marginBottom:'10px', height:'80px'}}/>
              <button type="submit" style={{width:'100%'}}>إرسال التقييم</button>
            </form>
          </div>
        )}
        {role === 'admin' && <p style={{color:'#ff6f00', fontWeight:'bold'}}>لا يمكن للمشرفين إضافة تقييمات</p>}
        {role === 'center' && <p style={{color:'#ff6f00', fontWeight:'bold'}}>لا يمكن للمراكز إضافة تقييمات</p>}
      </div>
    </div>
  );
}

export default CenterDetails;