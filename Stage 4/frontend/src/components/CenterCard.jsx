import { Link } from "react-router-dom";

function CenterCard({ center }) {
  return (
    <div className="card">
      <h2>{center.name}</h2>
      <p>{center.location}</p>
      <p>{center.description}</p>
      <Link to={`/centers/${center.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default CenterCard;
