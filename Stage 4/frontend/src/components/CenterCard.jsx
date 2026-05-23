import { Link } from "react-router-dom";

function CenterCard({ center }) {
  return (
    <div className="card">
      {center.image ? (
        <img src={center.image} alt={center.name} className="card-image" />
      ) : (
        <div className="center-image-placeholder">🏫</div>
      )}
      <div className="rating">
        ⭐ {center.average_rating || 0}
        <span> ({center.review_count || 0} reviews)</span>
      </div>
      <div className="card-content">
        <h2>{center.name}</h2>
        <p className="location">📍 {center.location}</p>
        <p className="description">{center.description}</p>
        <Link to={`/centers/${center.id}`}>
          <button>View Details</button>
        </Link>
      </div>
    </div>
  );
}

export default CenterCard;
