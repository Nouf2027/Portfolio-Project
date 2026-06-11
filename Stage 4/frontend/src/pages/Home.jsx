import { useState, useEffect, useMemo } from 'react';
import CenterCard from "../components/CenterCard";
import API from "../api/axios";

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    API.get('/centers')
      .then(res => {
        setCenters(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('حدث خطأ أثناء تحميل المراكز. حاول مجدداً.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCenters = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return centers.filter(center =>
      center.name?.toLowerCase().includes(search) ||
      center.city?.toLowerCase().includes(search) ||
      center.category?.toLowerCase().includes(search)
    );
  }, [centers, searchTerm]);

  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <h1>اعثر على أفضل مراكز تنمية المهارات لطفلك</h1>
          <p>اكتشف مراكز موثوقة في الفنون والبرمجة والعلوم وغيرها</p>
          <a href="/search" className="hero-button">ابدأ البحث</a>
        </div>
      </section>
      <section className="featured-section">
        <h2>المراكز المميزة</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث عن مركز أو مدينة أو تصنيف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="cards-container">
          {loading ? (
            <p>جاري البحث...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredCenters.length === 0 ? (
            <p>لا توجد نتائج مطابقة.</p>
          ) : (
            filteredCenters.map((center) => (
              <CenterCard key={center._id || center.id} center={center} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
