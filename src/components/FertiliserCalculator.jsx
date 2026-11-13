
import { useState } from "react";
import {
  calculateCupFertiliserRequirement,
  FERTILISER_CUP_SIZES,
} from "../src/utils/maizeCalculations";

export default function FertiliserCalculator() {
  const [area, setArea] = useState("1");
  const [rowSpacing, setRowSpacing] = useState("90");
  const [stationSpacing, setStationSpacing] = useState("60");
  const [applicationType, setApplicationType] = useState("basal");
  const [cupSize, setCupSize] = useState("12");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCalculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      const calculation = calculateCupFertiliserRequirement({
        applicationType,
        rowSpacingCm: Number(rowSpacing),
        stationSpacingCm: Number(stationSpacing),
        cupSize: Number(cupSize),
        fieldAreaHa: Number(area),
      });

      setResult(calculation);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="fertiliser-calculator" aria-labelledby="fertiliser-title">
      <div className="calculator-heading">
        <div className="calculator-title-row">
          <span className="calculator-icon fertiliser-page-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.5 3.5C10 3.5 4 7.5 4 14a6.5 6.5 0 0 0 6.5 6.5c6.5 0 10.5-6 10-17Z" /><path d="M3 21c3-5 7-8 13-11" />
            </svg>
          </span>
          <div>
            <span className="calculator-label">NUTRIENT PLANNER</span>
            <h2 id="fertiliser-title">Fertiliser Calculator</h2>
          </div>
        </div>
        <p>
          Plan a calibrated application using your field size, planting spacing and cup size.
        </p>
      </div>

      <form onSubmit={handleCalculate}>
        <div className="form-section-heading">
          <strong>Application details</strong>
          <span>Choose your field layout and application stage</span>
        </div>
        <div className="calculator-grid">
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
            Plant/station spacing
            <select
              value={stationSpacing}
              onChange={(e) => setStationSpacing(e.target.value)}
            >
              <option value="60">60 cm</option>
              <option value="50">50 cm</option>
              <option value="40">40 cm</option>
              <option value="30">30 cm</option>
            </select>
          </label>

          <label>
            Application stage
            <select
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
            >
              <option value="basal">Basal fertiliser</option>
              <option value="topDressing">Top dressing</option>
            </select>
          </label>

          <label>
            Calibrated cup size
            <select
              value={cupSize}
              onChange={(e) => setCupSize(e.target.value)}
            >
              {FERTILISER_CUP_SIZES.map((size) => (
                <option key={size} value={size}>
                  Cup size {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className="calculate-button">
          Calculate fertiliser <span aria-hidden="true">→</span>
        </button>
      </form>

      {error && <p className="calculator-error">{error}</p>}

      {result && (
        <div className="calculation-result" aria-live="polite">
          <div className="result-heading">
            <span className="result-kicker">YOUR APPLICATION ESTIMATE</span>
            <h3>Fertiliser requirement</h3>
          </div>

          <div className="result-grid">
            <div>
              <span>Application rate</span>
              <strong>{result.rateKgPerHa} kg/ha</strong>
            </div>

            <div>
              <span>Total fertiliser</span>
              <strong>{result.totalKg} kg</strong>
            </div>

            <div>
              <span>50 kg bags</span>
              <strong>{result.totalBags}</strong>
            </div>
          </div>

          <p>
            This calculation uses the selected cup size and
            planting spacing from the growers' guide.
          </p>
        </div>
      )}

      <p className="calculator-disclaimer">
        Important: These figures reproduce the guide's
        calibrated cup tables. Actual fertiliser application
        should also consider soil fertility, fertiliser
        formulation and locally validated recommendations.
      </p>
    </section>
  );
}
