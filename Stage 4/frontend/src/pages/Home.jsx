import CenterCard from "../components/CenterCard";

const centers = [
  {
    name: "Creative Art Studio",
    location: "Riyadh",
    category: "Art",
    rating: 4.7,
    image: "https://via.placeholder.com/150",
  },
];

function Home() {
  return (
    <div>
      <h1>Discover Skill Centers for Your Child</h1>

      {centers.map((center, index) => (
        <CenterCard key={index} center={center} />
      ))}
    </div>
  );
}

export default Home;
