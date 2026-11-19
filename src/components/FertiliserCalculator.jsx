import { useState } from "react";
import {
  calculateCupFertiliserRequirement,
  getMalawiMaizeFertiliserRecommendation,
  MALAWI_MAIZE_FERTILISER_GUIDE,
  FERTILISER_CUP_SIZES,
  acresToHectares
} from "../src/utils/maizeCalculations";
import { useCalculatorResults } from "./CalculatorResultsContext";

export default function FertiliserCalculator() {
  const { setCalculatorResults, setFarmInputCostValues } =
    useCalculatorResults();
  const [area, setArea] = useState("1");
  const [areaUnit, setAreaUnit] = useState("hectares"); // NEW
  const [rowSpacing, setRowSpacing] = useState("90");
  const [stationSpacing, setStationSpacing] = useState("60");
  const [applicationType, setApplicationType] = useState("basal");
  const [cupSize, setCupSize] = useState("12");
  const [result, setResult] = useState(null);
  const [selectedAdd, setSelectedAdd] = useState("Blantyre");
  const [selectedGuideArea, setSelectedGuideArea] = useState("");
  const [productionPurpose, setProductionPurpose] = useState("home");
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationError, setRecommendationError] = useState("");
  const [error, setError] = useState("");

  function handleRecommendation(event) {
    event.preventDefault();
    setRecommendationError("");
    setRecommendation(null);
    try {
      const guide = getMalawiMaizeFertiliserRecommendation({
        add: selectedAdd,
        area: selectedGuideArea,
        productionPurpose,
      });
      setRecommendation(guide);
    } catch (err) {
      setRecommendationError(err.message);
    }
  }

  function handleCalculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      // Convert to hectares if the user selected acres
      const fieldAreaHa = areaUnit === "acres" 
        ? acresToHectares(Number(area)) 
        : Number(area);

      const calculation = calculateCupFertiliserRequirement({
        applicationType,
        rowSpacingCm: Number(rowSpacing),
        stationSpacingCm: Number(stationSpacing),
        cupSize: Number(cupSize),
        fieldAreaHa: fieldAreaHa,
      });

      setResult(calculation);
      setCalculatorResults((previous) => ({
        ...previous,
        [applicationType === "basal"
          ? "basalFertiliserKg"
          : "topDressingFertiliserKg"]: calculation.totalKg,
      }));
      const quantityKey =
        applicationType === "basal"
          ? "basalFertiliserQuantityKg"
          : "topDressingFertiliserQuantityKg";
      const linkedKey =
        applicationType === "basal"
          ? "basalQuantityFromCalculator"
          : "topDressingQuantityFromCalculator";
      setFarmInputCostValues((previous) =>
        previous?.[linkedKey]
          ? { ...previous, [quantityKey]: String(calculation.totalKg) }
          : previous
      );
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
              <option value="25">25 cm</option>
              <option value="24">24 cm</option>
              <option value="22">22 cm</option>
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

      <section className="fertiliser-guide-planner" aria-labelledby="fertiliser-guide-title">
        <div className="form-section-heading">
          <strong id="fertiliser-guide-title">Malawi area-specific fertiliser reference</strong>
          <span>Look up the nutrient recommendation for your Agricultural Development Division and district/EPA</span>
        </div>
        <form onSubmit={handleRecommendation}>
          <div className="calculator-grid">
            <label>
              Agricultural Development Division (ADD)
              <select value={selectedAdd} onChange={(event) => {
                setSelectedAdd(event.target.value);
                setSelectedGuideArea("");
                setRecommendation(null);
              }}>
                {[...new Set(MALAWI_MAIZE_FERTILISER_GUIDE.map((item) => item.add))].map((add) => (
                  <option key={add} value={add}>{add} ADD</option>
                ))}
              </select>
            </label>
            <label>
              District / EPA area
              <select value={selectedGuideArea} onChange={(event) => {
                setSelectedGuideArea(event.target.value);
                setRecommendation(null);
              }} required>
                <option value="">Select district / EPA area</option>
                {MALAWI_MAIZE_FERTILISER_GUIDE.filter((item) => item.add === selectedAdd).map((item) => (
                  <option key={item.area} value={item.area}>{item.area}</option>
                ))}
              </select>
            </label>
            <label>
              Production purpose
              <select value={productionPurpose} onChange={(event) => {
                setProductionPurpose(event.target.value);
                setRecommendation(null);
              }}>
                <option value="home">Home consumption</option>
                <option value="sale">Market sale</option>
              </select>
            </label>
          </div>
          <button type="submit" className="calculate-button">
            Find area recommendation <span aria-hidden="true">→</span>
          </button>
        </form>
        {recommendationError && (
          <p className="calculator-error" role="alert">{recommendationError}</p>
        )}
        {recommendation && (
          <div className="calculation-result" aria-live="polite">
            <div className="result-heading">
              <span className="result-kicker">2021 AREA-SPECIFIC REFERENCE</span>
              <h3>{recommendation.add} ADD · {recommendation.area}</h3>
            </div>
            <div className="guide-range-card">
              <span>{recommendation.productionPurpose === "home" ? "Home consumption" : "Market sale"}</span>
              {recommendation.available ? (
                <strong>{recommendation.nutrientRecommendation}</strong>
              ) : (
                <strong>No recommendation listed (Nil)</strong>
              )}
              <small>Nutrient recommendation code (N:P:K + S where specified)</small>
            </div>
            <p>{recommendation.note}</p>
            <p className="guide-source">Source: {recommendation.source}. This table does not specify a single product rate in kg/ha. Do not treat the code above as a bag quantity or apply it as a product without confirming the nutrient formulation.</p>
          </div>
        )}
      </section>

      <p className="calculator-disclaimer">
        Important: These figures reproduce the guide's
        calibrated cup tables. Actual fertiliser application
        should also consider soil fertility, fertiliser
        formulation and locally validated recommendations.
      </p>
    </section>
  );
}