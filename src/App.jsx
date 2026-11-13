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
import SeedCalculator from "./components/SeedCalculator";
import FertiliserCalculator from "./components/FertiliserCalculator";
import PlantPopulationCalculator from "./components/PlantPopulationCalculator";
import BrandLogo from "./components/BrandLogo";

import "./components/SeedCalculator.css";
import "./components/FertiliserCalculator.css";
import "./components/PlantPopulationCalculator.css";
import "./App.css";

const navigation = [
  { label: "Dashboard", path: "/", icon: "grid" },
  { label: "Seed Calculator", path: "/seed-calculator", icon: "seed" },
  { label: "Fertiliser Calculator", path: "/fertiliser-calculator", icon: "leaf" },
  { label: "Plant Population", path: "/plant-population", icon: "plants" },
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
        <Brand variant="sidebar" />
        <Navigation />
        <div className="sidebar-note">
          <span className="sidebar-note-mark">✳</span>
          <p>Smarter planning starts with the right information.</p>
        </div>
      </aside>

      <header className="mobile-header">
        <Brand variant="sidebar-collapsed" />
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
      </header>

      {mobileMenuOpen && (
        <div className="mobile-navigation" id="mobile-navigation">
          <Navigation />
        </div>
      )}

      <main className="app-main">
        <header className="top-header">
          <BrandLogo variant="header" />
          <div className="top-header-context">
            <span>iNEST AGRO</span>
            <strong>Make smart decisions</strong>
          </div>
          <span className="header-location">
            <span aria-hidden="true">⌖</span> Malawi
          </span>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seed-calculator" element={<SeedCalculator />} />
            <Route path="/fertiliser-calculator" element={<FertiliserCalculator />} />
            <Route path="/plant-population" element={<PlantPopulationCalculator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="app-footer">
          <div className="footer-brand">
            <BrandLogo variant="footer" />
            <span>A product by iNest Systems</span>
          </div>
          <span>Smarter farming. Better decisions.</span>
        </footer>
      </main>
    </div>
  );
}

function Brand({ variant }) {
  return (
    <NavLink className="app-brand" to="/" aria-label="iNest Agro dashboard">
      <BrandLogo variant={variant} />
    </NavLink>
  );
}

const navigationIcons = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  seed: <><path d="M12 21V10" /><path d="M12 14c-5.3 0-8-2.7-8-8 5.3 0 8 2.7 8 8Z" /><path d="M12 11c0-4.7 2.7-7 8-7 0 5.3-2.7 8-8 8" /></>,
  leaf: <><path d="M20.5 3.5C10 3.5 4 7.5 4 14a6.5 6.5 0 0 0 6.5 6.5c6.5 0 10.5-6 10-17Z" /><path d="M3 21c3-5 7-8 13-11" /></>,
  plants: <><path d="M12 21v-9" /><path d="M12 16c-4.7 0-7-2.3-7-7 4.7 0 7 2.3 7 7Z" /><path d="M12 13c0-4 2.3-6 7-6 0 4.7-2.3 7-7 7" /><path d="M5 21h14" /></>,
};

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
          <span className="navigation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {navigationIcons[item.icon]}
            </svg>
          </span>
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
