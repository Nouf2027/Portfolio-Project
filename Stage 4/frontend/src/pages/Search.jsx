import { useState, useEffect } from "react";
import CenterCard from "../components/CenterCard";
import API from "../api/axios";

function Search() {
  const [searchText, setSearchText] = useState("");
  const [centers, setCenters] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    API.get('/centers')
      .then(res => {
        setCenters(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    const results = centers.filter((center) =>
      center.name.toLowerCase().includes(searchText.toLowerCase()) ||
      center.location.toLowerCase().includes(searchText.toLowerCase())
    );
    setFiltered(results);
  };

  return (
    <div className="search-page">
      <h1>Discover Skill Centers for Your Child</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a center..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="cards-container">
        {filtered.length > 0 ? (
          filtered.map((center, index) => (
            <CenterCard key={index} center={center} />
          ))
        ) : (
          <p>No centers found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
