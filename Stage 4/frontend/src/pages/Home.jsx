import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FiHome, FiMapPin, FiStar, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Loader from "../components/Loading";

const CENTERS_PER_PAGE = 9;

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const categories = [
    { value: "All",     label: "الكل" },
    { value: "فن",      label: "فن" },
    { value: "برمجة",   label: "برمجة" },
    { value: "لغات",    label: "لغات" },
    { value: "علوم",    label: "علوم" },
    { value: "رياضة",   label: "رياضة" },
  ];

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

 // ﺕﺮﺠّﻋ ﻞﻠﺼﻔﺣﺓ ﺍﻷﻮﻟﻯ ﻞﻣﺍ ﻲﺘﻐﻳﺭ ﺎﻠﻔﻠﺗﺭ ﺃﻭ ﺎﻠﺒﺤﺛ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory]);

  /* ── الفلتر المُصلح ──
     يدعم: center.category  OR  center.description  OR  أي كورس داخل المركز */
  const filteredCenters = centers.filter((center) => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      center.name?.toLowerCase().includes(text) ||
      center.location?.toLowerCase().includes(text) ||
      center.description?.toLowerCase().includes(text);
    
    const matchesCategory =
      selectedCategory === "All" ||
      center.category === selectedCategory ||
      center.description?.includes(selectedCategory) ||
      (Array.isArray(center.courses) &&
        center.courses.some(
          (c) =>
            c.description === selectedCategory ||
            c.type === selectedCategory
        ));

    return matchesSearch && matchesCategory;
  });

// حساب الصفحات
  const totalPages = Math.ceil(filteredCenters.length / CENTERS_PER_PAGE);
  const paginatedCenters = filteredCenters.slice(
    (currentPage - 1) * CENTERS_PER_PAGE,
    currentPage * CENTERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-page" dir="rtl">
      {/* ── Hero ── */}
      <section className="home-hero">
        <img src="/children.jpg" alt="أطفال يتعلمون" className="hero-image" />
        <div className="hero-overlay">
          <h1>ابحثي عن المركز المناسب لطفلك</h1>
          <p>اكتشفي أفضل المراكز التعليمية والترفيهية في مدينتك</p>
        </div>
      </section>

      {/* ── شريط الفلتر ── */}
      <section className="filter-bar">
        <div className="filter-categories">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={
                selectedCategory === cat.value ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="filter-search">
          <input
            type="text"
            placeholder="ابحثي عن مركز..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </section>

      {/* ── قائمة المراكز ── */}
      <section className="centers-section">
        <div className="section-header">
          <h2>المراكز المتاحة</h2>
          <p>{filteredCenters.length} مركز</p>
        </div>

        {filteredCenters.length === 0 ? (
          <div className="empty-centers">
            <h3>لا توجد مراكز تطابق البحث</h3>
            <p>جرّبي تغيير الفئة أو كلمة البحث</p>
          </div>
        ) : (
          <div className="centers-grid">
            {paginatedCenters.map((center) => (
              <div className="center-card" key={center.id || center._id}>
                {/* صورة المركز */}
                {center.image ? (
                  <img
                    src={center.image}
                    alt={center.name}
                    className="center-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="center-image-placeholder"
                  style={{ display: center.image ? "none" : "flex" }}
                >
                  <FiHome />
                </div>

                <div className="center-content">
                  <span className="center-category">
                    {center.category || "تنمية الطفل"}
                  </span>
                  <h3>{center.name}</h3>
                  <p className="center-location">
                    <FiMapPin /> {center.location || "الموقع غير محدد"}
                  </p>
                  <p className="center-description">
                    {center.description || "لا يوجد وصف متاح."}
                  </p>
                  <div className="center-rating">
                    <FiStar />
                    {center.review_count > 0
                      ? ` ${center.average_rating}`
                      : " لا يوجد تقييم"}
                    <span> ({center.review_count || 0} تقييم)</span>
                  </div>
                  <Link
                    to={`/centers/${center.id || center._id}`}
                    className="details-btn"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* ── (Pagination) ── */}
      {totalPages > 1 && filteredCenters.length > 0 && (
        <section className="pagination-section">
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="الصفحة السابقة"
            >
              <FiChevronRight />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="الصفحة التالية"
            >
              <FiChevronLeft />
            </button>
          </div>
        </section>
      )}
    </div>
  );
  }

export default Home;
