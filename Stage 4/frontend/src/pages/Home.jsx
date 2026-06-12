import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FiHome, FiMapPin, FiStar } from "react-icons/fi";

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    { value: "All", label: "الكل" },
    { value: "Art", label: "فن" },
    { value: "Programming", label: "برمجة" },
    { value: "Language", label: "لغات" },
    { value: "Science", label: "علوم" },
    { value: "Robotics", label: "روبوتيك" },
  ];

  const heroImageUrl = "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg";

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get("/centers");
        setCenters(res.data);
      } catch (err) {
        console.log("Failed to load centers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((center) => {
    const text = searchText.toLowerCase();
    const matchesSearch =
      center.name?.toLowerCase().includes(text) ||
      center.location?.toLowerCase().includes(text) ||
      center.description?.toLowerCase().includes(text);
    const matchesCategory =
      selectedCategory === "All" || center.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-box">جارٍ تحميل المراكز...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <img src={heroImageUrl} alt="أطفال يتعلمون" className="hero-image" />
        <div className="hero-overlay">
          <h1>اكتشفي أفضل مراكز التعلم لطفلك</h1>
          <p>جيل يساعد الأهل على إيجاد مراكز موثوقة، استكشاف الدورات، وقراءة التقييمات بسهولة.</p>
          <button className="hero-btn" onClick={() => navigate("/search")}>
            اكتشفي المزيد
          </button>
        </div>
      </section>

      <section className="filter-bar">
        {categories.map((category) => (
          <button
            key={category.value}
            className={selectedCategory === category.value ? "filter-btn active" : "filter-btn"}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </section>

      <section className="centers-section">
        <div className="section-header">
          <h2>المراكز المتاحة</h2>
          <p>{filteredCenters.length} تم العثور على مركز</p>
        </div>
        {filteredCenters.length === 0 ? (
          <div className="empty-centers">
            <h3>لا توجد مراكز</h3>
          </div>
        ) : (
          <div className="centers-grid">
            {filteredCenters.map((center) => (
              <div className="center-card" key={center.id || center._id}>
                {center.image ? (
                  <img
                    src={center.image}
                    alt={center.name}
                    className="center-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="center-image-placeholder"><FiHome /></div>
                )}
                <div className="center-content">
                  <span className="center-category">{center.category || "تنمية الطفل"}</span>
                  <h3>{center.name}</h3>
                  <p className="center-location"><FiMapPin /> {center.location || "الموقع غير محدد"}</p>
                  <p className="center-description">{center.description || "لا يوجد وصف متاح."}</p>
                  <div className="center-rating">
                    <FiStar /> {center.review_count > 0 ? center.average_rating : "لا يوجد تقييم"}
                    <span> ({center.review_count || 0} تقييم)</span>
                  </div>
                  <Link to={`/centers/${center.id || center._id}`} className="details-btn">
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
