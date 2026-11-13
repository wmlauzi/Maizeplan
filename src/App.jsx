import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Seed  from "./components/SeedCalculator";
import FertiliserCalculator from "./components/FertiliserCalculator";
import PlantPopulationCalculator from "./components/PlantPopulationCalculator";

import "./components/SeedCalculator.css";
import "./components/FertiliserCalculator.css";
import "./components/PlantPopulationCalculator.css";
import "./App.css";

const navigation = [
  { label: "Dashboard", path: "/", icon: "⌂" },
  { label: "Seed Calculator", path: "/seed-calculator", icon: "🌱" },
  { label: "Fertiliser Calculator", path: "/fertiliser-calculator", icon: "🌿" },
  { label: "Plant Population", path: "/plant-population", icon: "🌽" },
];

function ApplicationLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <Brand />
        <Navigation />
      </aside>

      <div className="mobile-header">
        <Brand />
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-navigation" id="mobile-navigation">
          <Navigation />
        </div>
      )}

      <main className="app-main">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seed-calculator" element={<SeedCalculator />} />
            <Route path="/fertiliser-calculator" element={<FertiliserCalculator />} />
            <Route path="/plant-population" element={<PlantPopulationCalculator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="app-footer">iNest Maize Planner</footer>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <NavLink className="app-brand" to="/" aria-label="iNest Maize Planner dashboard">
      <span className="brand-mark" aria-hidden="true">iN</span>
      <span className="brand-name">
        <strong>iNest</strong>
        <span>MAIZE PLANNER</span>
      </span>
    </NavLink>
  );
}

function Navigation() {
  return (
    <nav className="primary-navigation" aria-label="Main navigation">
      <span className="navigation-label">WORKSPACE</span>
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `navigation-link${isActive ? " active" : ""}`
          }
        >
          <span className="navigation-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ApplicationLayout />
    </BrowserRouter>
  );
}
