import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Art", "Programming", "Language", "Science", "Robotics"];

  const heroImage = { image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80" };

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get("/centers");
        const approvedCenters = res.data.filter((center) => center.approved === true);
        setCenters(approvedCenters);
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
        <div className="loading-box">Loading centers...</div>
      </div>
    );
  }

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="home-hero">
        <img src={heroImage.image} alt="hero" className="hero-bg-img" />
        <div className="hero-overlay">
          <h1>اكتشفي أفضل مراكز التعلم لطفلك</h1>
          <p>جيل يساعد الأهل على إيجاد مراكز موثوقة، استكشاف الدورات، وقراءة التقييمات بسهولة.</p>
          <button className="hero-cta-btn" onClick={() => navigate("/search")}>
            اكتشفي المزيد
          </button>
        </div>
      </section>

      {/* فلاتر */}
      <section className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "filter-btn active" : "filter-btn"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      {/* المراكز */}
      <section className="centers-section">
        <div className="section-header">
          <h2>Available Centers</h2>
          <p>{filteredCenters.length} center(s) found</p>
        </div>

        {filteredCenters.length === 0 ? (
          <div className="empty-centers">
            <h3>No centers found</h3>
            <p>Try searching with another keyword or category.</p>
          </div>
        ) : (
          <div className="centers-grid">
            {filteredCenters.map((center) => (
              <div className="center-card" key={center.id || center._id}>
                {center.image ? (
                  <img src={center.image} alt={center.name} className="center-image" />
                ) : (
                  <div className="center-image-placeholder">🏫</div>
                )}
                <div className="center-content">
                  <span className="center-category">{center.category || "Child Development"}</span>
                  <h3>{center.name}</h3>
                  <p className="center-location">📍 {center.location || "Location not added"}</p>
                  <p className="center-description">{center.description || "No description available."}</p>
                  <div className="center-rating">
                    ⭐ {center.rating || "4.8"}
                    <span> ({center.reviews_count || 0} reviews)</span>
                  </div>
                  <Link to={`/centers/${center.id || center._id}`} className="details-btn">
                    View Details
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
