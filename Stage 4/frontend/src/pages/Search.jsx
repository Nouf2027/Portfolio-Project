import { useState } from "react";
import CenterCard from "../components/CenterCard";
import centers from "../data/centers";

function Search() {
  const [searchText, setSearchText] = useState("");

  const filteredCenters = centers.filter((center) =>
    center.name.toLowerCase().includes(searchText.toLowerCase())
  );

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

        <button>Search</button>
      </div>

      <div className="cards-container">
  {filteredCenters.length > 0 ? (
    filteredCenters.map((center, index) => (
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
