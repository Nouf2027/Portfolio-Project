import { useParams } from "react-router-dom";
import centers from "../data/centers";

function CenterDetails() {
  const { id } = useParams();

  const center = centers.find((item) => item.id === Number(id));

  if (!center) {
    return <h1>Center not found</h1>;
  }

  return (
    <div className="details-page">
      <h1>{center.name}</h1>
      <p>{center.city}</p>
      <p>{center.category}</p>
      <p>{center.description}</p>
    </div>
  );
}

export default CenterDetails;
