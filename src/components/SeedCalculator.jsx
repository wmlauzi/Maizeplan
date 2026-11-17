import { useState } from "react";
import { 
  calculateSeedRequirement,
  acresToHectares 
} from "../src/utils/maizeCalculations";
import { useCalculatorResults } from "./CalculatorResultsContext";
import "./SeedCalculator.css";

export default function SeedCalculator() {
  const { setCalculatorResults, setFarmInputCostValues } =
    useCalculatorResults();
  const [area, setArea] = useState("1");
  const [areaUnit, setAreaUnit] = useState("hectares"); // NEW
  const [population, setPopulation] = useState("50000");
  const [seedsPerStation, setSeedsPerStation] = useState("1");
  const [seedSize, setSeedSize] = useState("medium");
  const [germination, setGermination] = useState("95");
  const [fieldLoss, setFieldLoss] = useState("5");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function calculate(seedCountPerStation = Number(seedsPerStation)) {
    setError("");
    setResult(null);

    try {
      // Convert to hectares if the user selected acres
      const fieldAreaHa = areaUnit === "acres" 
        ? acresToHectares(Number(area)) 
        : Number(area);

      const targetPopulationPerHa = Number(population);
      const germinationRate = Number(germination);
      const fieldLossRate = Number(fieldLoss);

      if (!Number.isInteger(targetPopulationPerHa)) {
        throw new Error("Target population must be a whole number.");
      }

      if (
        fieldAreaHa <= 0 ||
        targetPopulationPerHa <= 0 ||
        germinationRate <= 0 ||
        germinationRate > 100 ||
        fieldLossRate < 0 ||
        fieldLossRate >= 100
      ) {
        throw new Error("Please enter valid values. Rates must be within their permitted ranges.");
      }

      const calculation = calculateSeedRequirement({
        fieldAreaHa,
        targetPopulationPerHa,
        seedSize,
        seedsPerStation: seedCountPerStation,
        germinationRate,
        fieldLossRate,
      });

      setResult(calculation);
      setCalculatorResults((previous) => ({
        ...previous,
        seedKg: calculation.seedKg,
      }));
      setFarmInputCostValues((previous) =>
        previous?.seedQuantityFromCalculator
          ? {
              ...previous,
              seedQuantityKg: String(calculation.seedKg),
            }
          : previous
      );
    } catch (err) {
      setError(err.message || "Unable to calculate seed requirement.");
    }
  }

  function handleCalculate(event) {
    event.preventDefault();
    calculate();
  }

  return (
    <section className="seed-calculator" aria-labelledby="seed-title">
      <div className="seed-heading">
        <div className="calculator-title-row">
          <span className="calculator-icon seed-page-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21v-9" /><path d="M12 16c-5.3 0-8-2.7-8-8 5.3 0 8 2.7 8 8Z" /><path d="M12 12c0-4.7 2.7-7 8-7 0 5.3-2.7 8-8 8" />
            </svg>
          </span>
          <div>
            <span className="seed-label">PLANTING PLANNER</span>
            <h2 id="seed-title">Seed Calculator</h2>
          </div>
        </div>
        <p>
          Estimate the maize seed required for your field using your target population and seed quality.
        </p>
      </div>

      <form onSubmit={handleCalculate}>
        <div className="form-section-heading">
          <strong>Field and seed details</strong>
          <span>Enter your planned planting information</span>
        </div>
        <div className="seed-grid">
          
          {/* UPDATED AREA INPUT */}
          <div className="input-with-unit">
            <label>
              Field size
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <select 
                  value={areaUnit} 
                  onChange={(e) => setAreaUnit(e.target.value)}
                  style={{ width: "110px" }}
                >
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </label>
          </div>

          <label>
            Target population (plants per hectare)
            <input
              type="number"
              min="1"
              step="1"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              required
            />
          </label>

          <label>
            Seeds per planting station
            <select
              value={seedsPerStation}
              onChange={(event) => {
                const value = event.target.value;
                setSeedsPerStation(value);
                if (result) calculate(Number(value));
              }}
            >
              <option value="1">1 seed per station</option>
              <option value="2">2 seeds per station</option>
              <option value="3">3 seeds per station</option>
            </select>
          </label>

          <label>
            Seed size
            <select
              value={seedSize}
              onChange={(e) => setSeedSize(e.target.value)}
            >
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </label>

          <label>
            Germination rate (%)
            <input
              type="number"
              min="1"
              max="100"
              value={germination}
              onChange={(e) => setGermination(e.target.value)}
              required
            />
          </label>

          <label>
            Expected field loss (%)
            <input
              type="number"
              min="0"
              max="99"
              value={fieldLoss}
              onChange={(e) => setFieldLoss(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" className="seed-calculate-button">
          Calculate seed requirement <span aria-hidden="true">→</span>
        </button>
      </form>

      {error && <p className="seed-error">{error}</p>}

      {result && (
        <div className="seed-result" aria-live="polite">
          <div className="result-lead">
            <span className="result-kicker">ESTIMATED SEED REQUIREMENT</span>
            <strong>{result.seedKg.toFixed(2)} <small>kg</small></strong>
            <p>For {area} {areaUnit} at {Number(population).toLocaleString()} plants per hectare.</p>
            <p>Sowing {result.seedsPerStation} {result.seedsPerStation === 1 ? "seed" : "seeds"} per planting station.</p>
          </div>
          <div className="seed-result-note">
            <span aria-hidden="true">i</span>
            <p>Estimate includes your selected germination rate and expected field loss.</p>
          </div>
        </div>
      )}

      <p className="seed-disclaimer">
        This is an estimate based on the selected seed size,
        germination rate and expected field loss. Actual seed
        requirements may vary by seed lot and planting conditions.
      </p>
    </section>
  );
}