import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  FaShieldAlt,
  FaBuilding,
  FaCalendarAlt,
  FaBook,
  FaCheck,
  FaTrash,
  FaPlus,
  FaEye,
  FaStar,
  FaFileAlt,
  FaImage,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("centers");
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  useEffect(() => {
    setLoading(true);

    if (role === "admin") {
      Promise.all([
        API.get("/centers/all"),
        API.get("/bookings/all"),
        API.get("/courses"),
      ])
        .then(([centersRes, bookingsRes, coursesRes]) => {
          setCenters(centersRes.data);
          setBookings(bookingsRes.data);
          setCourses(coursesRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      API.get("/centers")
        .then((res) => {
          setCenters(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setSuccess("تمت الموافقة على المركز بنجاح");
      setCenters(
        centers.map((c) => (c.id === id ? { ...c, approved: true } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setSuccess("تم حذف المركز بنجاح");
      setCenters(centers.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      let licenseUrl = "";

      // الخطوة ١: رفع الصورة لكلاوديناري
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      }

      // الخطوة ٢: حفظ المركز مع الرابط
      await API.post("/centers", {
        name,
        location,
        description,
        image: imageUrl,
        license_file: licenseUrl,
      });

      setSuccess("تم إرسال بيانات المركز بنجاح، بانتظار موافقة الإدارة");
      setShowForm(false);
      setName("");
      setLocation("");
      setDescription("");
      setImage(null);
      setLicenseFile(null);

      if (role === "admin") {
        const res = await API.get("/centers/all");
        setCenters(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCenterBookingsCount = (center) => {
    return bookings.filter(
      (b) => b.center_id === center.id || b.center_name === center.name
    ).length;
  };

  const getCenterCoursesCount = (center) => {
    return courses.filter(
      (c) => c.center_id === center.id || c.center_name === center.name
    ).length;
  };

  if (loading) return <div className="loader"></div>;

  if (role === "admin") {
    return (
      <div className="dashboard-page" dir="rtl">
        <div className="admin-dashboard">
          <div className="admin-header">
            <div>
              <p className="admin-subtitle">مرحبًا بك</p>
              <h1 className="dashboard-title">
                <FaShieldAlt />
                لوحة تحكم الإدارة
              </h1>
            </div>

            <button
              className="admin-add-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus />
              إضافة مركز
            </button>
          </div>

          {success && <p className="success-message">{success}</p>}

          {showForm && (
            <form onSubmit={handleAddCenter} className="form-container admin-form">
              <input
                type="text"
                placeholder="اسم المركز"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="الموقع"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="الوصف"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <label>صورة المركز</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label>وثيقة أو ترخيص المركز</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setLicenseFile(e.target.files[0])}
              />
              <button type="submit">حفظ المركز</button>
            </form>
          )}

          <div className="tabs admin-tabs">
            <button
              className={activeTab === "centers" ? "tab active" : "tab"}
              onClick={() => setActiveTab("centers")}
            >
              <FaBuilding />
              المراكز
            </button>
            <button
              className={activeTab === "bookings" ? "tab active" : "tab"}
              onClick={() => setActiveTab("bookings")}
            >
              <FaCalendarAlt />
              الحجوزات
            </button>
            <button
              className={activeTab === "courses" ? "tab active" : "tab"}
              onClick={() => setActiveTab("courses")}
            >
              <FaBook />
              الكورسات
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>{centers.length}</h3>
              <p>إجمالي المراكز</p>
            </div>
            <div className="stat-card">
              <h3>{centers.filter((c) => c.approved).length}</h3>
              <p>المراكز المقبولة</p>
            </div>
            <div className="stat-card">
              <h3>{centers.filter((c) => !c.approved).length}</h3>
              <p>بانتظار الموافقة</p>
            </div>
            <div className="stat-card">
              <h3>{bookings.length}</h3>
              <p>إجمالي الحجوزات</p>
            </div>
            <div className="stat-card">
              <h3>{courses.length}</h3>
              <p>إجمالي الكورسات</p>
            </div>
          </div>

          <div className="admin-content-box">
            {activeTab === "centers" && (
              <div className="dashboard-cards">
                {centers.length === 0 ? (
                  <p>لا توجد مراكز حتى الآن</p>
                ) : (
                  centers.map((center) => (
                    <div key={center.id} className="dashboard-box">
                      {center.image && (
                        <img
                          src={center.image}
                          alt={center.name}
                          className="admin-center-image"
                        />
                      )}
                      <h2>{center.name}</h2>
                      <p>
                        <FaMapMarkerAlt className="inline-icon" />
                        {center.location}
                      </p>
                      <p>{center.description}</p>
                      <p>
                        <strong>الحالة:</strong>{" "}
                        <span className={center.approved ? "status-approved" : "status-pending"}>
                          {center.approved ? "مقبول" : "بانتظار الموافقة"}
                        </span>
                      </p>
                      <p>
                        <strong>عدد الحجوزات:</strong>{" "}
                        {getCenterBookingsCount(center)}
                      </p>
                      <p>
                        <strong>عدد الكورسات:</strong>{" "}
                        {getCenterCoursesCount(center)}
                      </p>
                      <p>
                        <FaEye className="inline-icon" />
                        <strong>المشاهدات:</strong> {center.views || 0}
                      </p>
                      <p>
                        <FaStar className="inline-icon" />
                        <strong>التقييم:</strong>{" "}
                        {center.average_rating || "لا يوجد"}
                      </p>
                      <p>
                        <strong>عدد التقييمات:</strong>{" "}
                        {center.review_count || 0}
                      </p>
                      <div className="admin-files">
                        {center.image && (
                          <a href={center.image} target="_blank" rel="noreferrer">
                            <FaImage />
                            عرض الصورة
                          </a>
                        )}
                        {center.license_file && (
                          <a href={center.license_file} target="_blank" rel="noreferrer">
                            <FaFileAlt />
                            عرض الوثيقة
                          </a>
                        )}
                      </div>
                      <div className="admin-actions">
                        {!center.approved && (
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(center.id)}
                          >
                            <FaCheck />
                            قبول
                          </button>
                        )}
                        <button
                          className="delete-center-btn"
                          onClick={() => handleDelete(center.id)}
                        >
                          <FaTrash />
                          حذف
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="modern-table-wrapper">
                {bookings.length === 0 ? (
                  <p>لا توجد حجوزات حتى الآن</p>
                ) : (
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>المركز</th>
                        <th>الكورس</th>
                        <th>المستخدم</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.center_name}</td>
                          <td>{booking.course_name}</td>
                          <td>{booking.email}</td>
                          <td>
                            {booking.date
                              ? new Date(booking.date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="dashboard-cards">
                {courses.length === 0 ? (
                  <p>لا توجد كورسات حتى الآن</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="dashboard-box">
                      <h3>{course.name}</h3>
                      <p><strong>المركز:</strong> {course.center_name || "غير محدد"}</p>
                      <p><strong>المدرب:</strong> {course.instructor || "غير محدد"}</p>
                      <p><strong>الوصف:</strong> {course.description || "لا يوجد"}</p>
                      <p><strong>الأيام:</strong> {course.days || "-"}</p>
                      <p><strong>الوقت:</strong> {course.times || "-"}</p>
                      <p><strong>المدة:</strong> {course.duration || "-"}</p>
                      <p><strong>السعر:</strong> {course.price} ريال</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (role === "center") {
    return (
      <div className="dashboard-page" dir="rtl">
        <h1>بوابة المركز</h1>
        {success && <p className="success-message">{success}</p>}
        <button onClick={() => setShowForm(!showForm)} className="admin-add-btn">
          <FaPlus />
          إضافة مركزي
        </button>
        {showForm && (
          <form onSubmit={handleAddCenter} className="form-container admin-form">
            <input
              type="text"
              placeholder="اسم المركز"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="الموقع"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="الوصف"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label>صورة المركز</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label>وثيقة أو ترخيص المركز</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setLicenseFile(e.target.files[0])}
            />
            <button type="submit">إرسال للمراجعة</button>
          </form>
        )}
        <p className="status-pending">سيظهر مركزك بعد موافقة الإدارة.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" dir="rtl">
      <h1>حسابي</h1>
      <p>يمكنك إدارة حسابك من هنا.</p>
    </div>
  );
}

export default Dashboard;
