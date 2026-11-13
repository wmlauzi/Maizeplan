
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
    <section className="population-calculator">
      <div className="population-heading">
        <span className="population-label">MAIZE FARMING TOOL</span>
        <h2>Plant Population Calculator</h2>
        <p>
          Calculate your maize plant population using
          your field size and planting spacing.
        </p>
      </div>

      <form onSubmit={handleCalculate}>
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
          Calculate plant population
        </button>
      </form>

      {error && <p className="population-error">{error}</p>}

      {result && (
        <div className="population-result">
          <h3>Estimated plant population</h3>

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
        This is a theoretical plant population based on
        the selected spacing. Actual established population
        may be lower due to germination and field losses.
      </p>
    </section>
  );
}
