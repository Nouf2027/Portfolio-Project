
function CenterCard({ center, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {center.image && (
        <img
          src={center.image}
          alt={center.name}
          className="card-image"
        />
      )}
      <div className="rating">
  ⭐ {center.average_rating || 0}
  <span> ({center.review_count || 0} reviews)</span>
</div>

      <div className="card-content">
        <h2>{center.name}</h2>

        <p className="location">
          📍 {center.location}
        </p>

        <p className="description">
          {center.description}
        </p>

        <button>View Details</button>
      </div>
    </div>
  );
}

export default CenterCard;