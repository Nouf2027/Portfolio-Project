function CenterCard({ center }) {
  return (
    <div className="center-card">
      <img src={center.image} alt={center.name} />
      <h3>{center.name}</h3>
      <p>{center.location}</p>
      <p>{center.category}</p>
      <p> {center.rating}</p>
      <button>View Details</button>
    </div>
  );
}

export default CenterCard;
