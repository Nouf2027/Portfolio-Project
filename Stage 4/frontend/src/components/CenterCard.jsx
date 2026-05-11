import { Link } from "react-router-dom";

function CenterCard({ center }) {
  return (
    <div className="card">

      <img src={center.image} alt={center.name} />

      <h2>{center.name}</h2>

      <p>{center.city}</p>

      <p>{center.category}</p>

      <Link to={`/centers/${center.id}`}>
        <button>View Details</button>
      </Link>

    </div>
  );
}

export default CenterCard;