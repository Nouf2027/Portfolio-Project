import CenterCard from "../components/CenterCard";
import centers from "../data/centers";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <h1>Find the Best Skill Centers for Your Child</h1>
          <p>
            Discover trusted centers in art, programming, science, and more.
          </p>
          <a href="/search" className="hero-button">Start Searching</a>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Centers</h2>

        <div className="cards-container">
          {centers.map((center) => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;