import { useState, useEffect } from 'react';
import CenterCard from "../components/CenterCard";
import API from "../api/axios";

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/centers')
      .then(res => {
        setCenters(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <h1>Find the Best Skill Centers for Your Child</h1>
          <p>Discover trusted centers in art, programming, science, and more.</p>
          <a href="/search" className="hero-button">Start Searching</a>
        </div>
      </section>
      <section className="featured-section">
        <h2>Featured Centers</h2>
        <div className="cards-container">
          {loading ? (
            <p>Loading...</p>
          ) : centers.length === 0 ? (
            <p>No centers found.</p>
          ) : (
            centers.map((center, index) => (
              <CenterCard key={index} center={center} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
