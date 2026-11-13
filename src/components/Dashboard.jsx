
import "./Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-tag">SMART MAIZE FARMING</span>

          <h2>Plan better. Farm smarter. Grow more.</h2>

          <p>
            Welcome to iNest Maize Planner, your digital
            assistant for planning and managing maize production.
          </p>

          <a href="#farm-tools" className="dashboard-button">
            Explore farming tools
          </a>
        </div>
      </section>

      <section className="dashboard-tools" id="farm-tools">
        <div className="dashboard-section-heading">
          <span>YOUR FARMING TOOLS</span>
          <h2>Production planning tools</h2>
          <p>
            Use these calculators to make informed maize
            production decisions.
          </p>
        </div>

        <div className="dashboard-tool-grid">
          <Link to="/seed-calculator" className="dashboard-tool-card">
            <span className="dashboard-icon">🌱</span>
            <h3>Seed Calculator</h3>
            <p>Estimate how much maize seed you need for your field.</p>
            <strong>Open calculator →</strong>
          </Link>

          <Link to="/fertiliser-calculator" className="dashboard-tool-card">
            <span className="dashboard-icon">🌿</span>
            <h3>Fertiliser Calculator</h3>
            <p>Estimate basal and top-dressing fertiliser requirements.</p>
            <strong>Open calculator →</strong>
          </Link>

          <Link to="/plant-population" className="dashboard-tool-card">
            <span className="dashboard-icon">🌽</span>
            <h3>Plant Population</h3>
            <p>Calculate the expected number of plants in your field.</p>
            <strong>Open calculator →</strong>
          </Link>
        </div>
      </section>
    </div>
  );
}
