
import { useState } from "react";
import { calculateSeedRequirement } from "../src/utils/maizeCalculations";
import "./SeedCalculator.css";

export default function SeedCalculator() {
  const [area, setArea] = useState("1");
  const [population, setPopulation] = useState("50000");
  const [seedSize, setSeedSize] = useState("medium");
  const [germination, setGermination] = useState("95");
  const [fieldLoss, setFieldLoss] = useState("5");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCalculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      const fieldAreaHa = Number(area);
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
        germinationRate,
        fieldLossRate,
      });

      setResult(calculation);
    } catch (err) {
      setError(err.message || "Unable to calculate seed requirement.");
    }
  }

  return (
    <section className="seed-calculator">
      <div className="seed-heading">
        <span className="seed-label">MAIZE FARMING TOOL</span>
        <h2>Seed Calculator</h2>
        <p>
          Estimate the maize seed required for your field
          using your target plant population and seed quality.
        </p>
      </div>

      <form onSubmit={handleCalculate}>
        <div className="seed-grid">
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
          Calculate seed requirement
        </button>
      </form>

      {error && <p className="seed-error">{error}</p>}

      {result && (
        <div className="seed-result">
          <h3>Estimated seed requirement</h3>
          <strong>{result.seedKg.toFixed(2)} kg</strong>
          <p>
            Estimated seed needed for {area} hectare(s)
            at a target population of{" "}
            {Number(population).toLocaleString()} plants per hectare.
          </p>
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
