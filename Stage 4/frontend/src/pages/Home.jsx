import { useState, useEffect } from "react";
import CenterCard from "../components/CenterCard";
import API from "../api/axios";
import Loading from "../components/Loading";

function Home() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Art", "Programming", "Language", "Science", "Robotics"];

  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        centre_id: selectedCenter.id,
        rating,
        comment,
      });

      alert("Review submitted successfully");
      setRating(5);
      setComment("");
    } catch (err) {
      console.log(err);
      alert("Please login before submitting a review");
    }
  };

  const filteredCenters = centers.filter((center) => {
    const matchesSearch = center.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || center.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    API.get("/centers")
      .then((res) => {
        setCenters(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-slider">
          <div className="slide-track">
            <img src="/img1.jpg" alt="center" />
            <img src="/img2.jpg" alt="center" />
            <img src="/img3.jpg" alt="center" />
          </div>
        </div>
      </section>

      <div className="filter-row">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "category active" : "category"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="home-search">
          <input
            type="text"
            placeholder="Search centers..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-container">
        {loading ? (
          <Loading />
        ) : centers.length === 0 ? (
          <div className="empty-state">
            <h3>No centers found</h3>
            <p>Try adjusting your search terms.</p>
          </div>
        ) : (
          filteredCenters.map((center, index) => (
            <CenterCard
              key={index}
              center={center}
              onClick={() => setSelectedCenter(center)}
            />
          ))
        )}
      </div>

      {selectedCenter && (
        <div className="popup-overlay" onClick={() => setSelectedCenter(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCenter(null)}>
              ×
            </button>

            {selectedCenter.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedCenter.image}`}
                alt={selectedCenter.name}
                className="popup-image"
              />
            )}

            <h2>{selectedCenter.name}</h2>
            <p>{selectedCenter.location}</p>
            <p>{selectedCenter.description}</p>

            {localStorage.getItem("user") ? (
              <div className="review-box">
                <h3>Rate this center</h3>

                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>

                <textarea
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button onClick={submitReview}>Submit Review</button>
              </div>
            ) : (
              <p className="login-note">Login to rate this center</p>
            )}

            <button>Book Now</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;