
import { useState } from "react";
import { calculatePlantPopulation } from "../src/utils/maizeCalculations";
import "./PlantPopulationCalculator.css";

export default function PlantPopulationCalculator() {
  const [rowSpacing, setRowSpacing] = useState("90");
  const [plantSpacing, setPlantSpacing] = useState("60");
  const [plantsPerStation, setPlantsPerStation] = useState("2");
  const [area, setArea] = useState("1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCalculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      const calculation = calculatePlantPopulation({
        rowSpacingCm: Number(rowSpacing),
        plantSpacingCm: Number(plantSpacing),
        plantsPerStation: Number(plantsPerStation),
        fieldAreaHa: Number(area),
      });

      const populationPerHa =
        typeof calculation === "number"
          ? calculation
          : calculation.plantsPerHa;

      if (!Number.isFinite(populationPerHa)) {
        throw new Error("The population calculation returned an unexpected result.");
      }

      setResult({
        plantsPerHa: Math.round(populationPerHa),
        totalPlants: Math.round(populationPerHa * Number(area)),
      });
    } catch (err) {
      setError(err.message || "Unable to calculate plant population.");
    }
  }

  return (
    <section className="population-calculator" aria-labelledby="population-title">
      <div className="population-heading">
        <div className="calculator-title-row">
          <span className="calculator-icon population-page-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21v-9" /><path d="M12 16c-4.7 0-7-2.3-7-7 4.7 0 7 2.3 7 7Z" /><path d="M12 13c0-4 2.3-6 7-6 0 4.7-2.3 7-7 7" /><path d="M5 21h14" />
            </svg>
          </span>
          <div>
            <span className="population-label">FIELD ESTIMATOR</span>
            <h2 id="population-title">Plant Population Calculator</h2>
          </div>
        </div>
        <p>
          Estimate plant numbers from your field size and chosen planting layout.
        </p>
      </div>

      <form onSubmit={handleCalculate}>
        <div className="form-section-heading">
          <strong>Field layout</strong>
          <span>Set your spacing and plants per station</span>
        </div>
        <div className="population-grid">
          <label>
            Field size (hectares)
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </label>

          <label>
            Row spacing
            <select
              value={rowSpacing}
              onChange={(e) => setRowSpacing(e.target.value)}
            >
              <option value="100">100 cm</option>
              <option value="90">90 cm</option>
              <option value="75">75 cm</option>
              <option value="50">50 cm</option>
            </select>
          </label>

          <label>
            Plant spacing within rows
            <select
              value={plantSpacing}
              onChange={(e) => setPlantSpacing(e.target.value)}
            >
              <option value="60">60 cm</option>
              <option value="50">50 cm</option>
              <option value="40">40 cm</option>
              <option value="30">30 cm</option>
              <option value="25">25 cm</option>
              <option value="24">24 cm</option>
              <option value="22">22 cm</option>
            </select>
          </label>

          <label>
            Plants per station
            <select
              value={plantsPerStation}
              onChange={(e) => setPlantsPerStation(e.target.value)}
            >
              <option value="1">1 plant</option>
              <option value="2">2 plants</option>
              <option value="3">3 plants</option>
            </select>
          </label>
        </div>

        <button type="submit" className="population-button">
          Calculate plant population <span aria-hidden="true">→</span>
        </button>
      </form>

      {error && <p className="population-error">{error}</p>}

      {result && (
        <div className="population-result" aria-live="polite">
          <div className="result-heading">
            <span className="result-kicker">YOUR PLANTING ESTIMATE</span>
            <h3>Estimated plant population</h3>
          </div>

          <div className="population-result-grid">
            <div>
              <span>Plants per hectare</span>
              <strong>{result.plantsPerHa.toLocaleString()}</strong>
            </div>

            <div>
              <span>Total plants on your farm</span>
              <strong>{result.totalPlants.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      <p className="population-disclaimer">
        This theoretical estimate uses your selected spacing. Actual established population may be lower due to germination and field losses.
      </p>
    </section>
  );
}
