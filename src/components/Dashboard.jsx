
import "./Dashboard.css";
import { Link } from "react-router-dom";
import heroImage from "../assets/maize-field.jpg";

const tools = [
  {
    path: "/seed-calculator",
    category: "PLANTING PLANNER",
    title: "Seed Calculator",
    description: "Estimate the seed needed for your field using population targets and seed quality.",
    icon: "seed",
  },
   {
    path: "/plant-population",
    category: "FIELD ESTIMATOR",
    title: "Plant Population",
    description: "Estimate plants per hectare from your field spacing and plants per station.",
    icon: "plants",
  },
  {
    path: "/fertiliser-calculator",
    category: "NUTRIENT PLANNER",
    title: "Fertiliser Calculator",
    description: "Plan calibrated basal and top-dressing applications for your planting layout.",
    icon: "leaf",
  },
 
  {
    path: "/farm-input-costs",
    category: "BUDGET PLANNER",
    title: "Farm Input Cost Calculator",
    description: "Estimate how much you need to spend on maize seed, fertiliser, labour and other farm inputs.",
    icon: "cost",
  },
];

const toolIcons = {
  seed: <><path d="M12 21v-9" /><path d="M12 16c-5.3 0-8-2.7-8-8 5.3 0 8 2.7 8 8Z" /><path d="M12 12c0-4.7 2.7-7 8-7 0 5.3-2.7 8-8 8" /></>,
  leaf: <><path d="M20.5 3.5C10 3.5 4 7.5 4 14a6.5 6.5 0 0 0 6.5 6.5c6.5 0 10.5-6 10-17Z" /><path d="M3 21c3-5 7-8 13-11" /></>,
  plants: <><path d="M12 21v-9" /><path d="M12 16c-4.7 0-7-2.3-7-7 4.7 0 7 2.3 7 7Z" /><path d="M12 13c0-4 2.3-6 7-6 0 4.7-2.3 7-7 7" /><path d="M5 21h14" /></>,
  cost: <><circle cx="12" cy="12" r="9" /><path d="M15 8.5c-.6-.6-1.6-1-3-1-1.7 0-3 .8-3 2s1.3 2 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.4-.4-3-1" /><path d="M12 6v12" /></>,
};

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section
        className="dashboard-hero"
        style={{ "--hero-image": `url("${heroImage}")` }}
        aria-labelledby="dashboard-hero-title"
      >
        <div className="dashboard-hero-content">
          <span className="dashboard-tag"><span /> iNest Agro</span>
          <h1 id="dashboard-hero-title">Smarter Farming.<br />Better Decisions.</h1>
          <p>Make informed maize production decisions with intelligent agricultural planning tools designed to help you plan better and farm smarter.</p>
          <div className="hero-actions">
            <a href="#farm-tools" className="dashboard-button">
              Explore Farming Tools <span aria-hidden="true">↗</span>
            </a>
            <a href="#about-inest" className="dashboard-secondary-button">Learn More</a>
          </div>
          <span className="hero-photo-credit">MAIZE PRODUCTION PLANNING · MADE FOR MALAWI</span>
        </div>
        <span className="hero-side-caption">GROW WITH CONFIDENCE <i /></span>
      </section>

      <section className="dashboard-welcome" id="about-inest">
        <div>
          <span className="section-eyebrow">WELCOME TO INEST AGRO</span>
          <h2>Your farm, planned with clarity.</h2>
        </div>
        <p>Practical tools for farmers, agricultural professionals and farm managers across Malawi. Get a clearer view of your inputs before the season begins.</p>
      </section>

      <section className="dashboard-tools" id="farm-tools">
        <div className="dashboard-section-heading">
          <div>
            <span className="section-eyebrow">YOUR FARMING TOOLS</span>
            <h2>Plan your next move</h2>
          </div>
          <span className="tools-count"><b>04</b> CALCULATORS</span>
        </div>
        <div className="dashboard-tool-grid">
          {tools.map((tool, index) => (
            <Link to={tool.path} className="dashboard-tool-card" key={tool.path}>
              <span className="tool-card-topline"><span>0{index + 1}</span><span className="tool-card-arrow" aria-hidden="true">↗</span></span>
              <span className="dashboard-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{toolIcons[tool.icon]}</svg>
              </span>
              <span className="tool-category">{tool.category}</span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <strong>Open calculator <span aria-hidden="true">→</span></strong>
            </Link>
          ))}
        </div>
      </section>
      <div className="dashboard-signoff">A product by <strong>iNest Systems</strong><span>·</span> Made for Malawi’s growing season</div>
    </div>
  );
}
