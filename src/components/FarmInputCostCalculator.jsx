import { CONSTANTS } from "../src/utils/maizeCalculations";
import {
  calculateFarmInputCosts,
  formatMWK,
} from "../src/utils/farmInputCosts";
import { useCalculatorResults } from "./CalculatorResultsContext";

const initialAdditionalInputs = [
  { description: "Herbicides", cost: "" },
  { description: "Pesticides", cost: "" },
  { description: "Other agricultural inputs", cost: "" },
];

const labourFields = [
  { key: "landPreparation", label: "Land preparation" },
  { key: "planting", label: "Planting" },
  { key: "fertiliserApplication", label: "Fertiliser application" },
  { key: "weeding", label: "Weeding" },
  { key: "other", label: "Other labour expenses" },
];

function createInitialValues(results) {
  return {
    seedQuantityKg: results.seedKg === null ? "" : String(results.seedKg),
    seedQuantityFromCalculator: true,
    seedPricePerKg: "",
    basalFertiliserQuantityKg:
      results.basalFertiliserKg === null
        ? ""
        : String(results.basalFertiliserKg),
    basalQuantityFromCalculator: true,
    basalBagWeightKg: String(CONSTANTS.FERTILISER_BAG_KG),
    basalPricePerBag: "",
    topDressingFertiliserQuantityKg:
      results.topDressingFertiliserKg === null
        ? ""
        : String(results.topDressingFertiliserKg),
    topDressingQuantityFromCalculator: true,
    topDressingBagWeightKg: String(CONSTANTS.FERTILISER_BAG_KG),
    topDressingPricePerBag: "",
    additionalInputs: initialAdditionalInputs.map((input) => ({ ...input })),
    labourCosts: {
      landPreparation: "",
      planting: "",
      fertiliserApplication: "",
      weeding: "",
      other: "",
    },
  };
}

function CostField({
  id,
  label,
  value,
  onChange,
  error,
  type = "number",
  min,
  step,
  placeholder,
  disabled = false,
}) {
  const errorId = `${id}-error`;

  return (
    <div className="cost-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        min={min}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span className="cost-field-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}

function FertiliserCostSection({
  title,
  stage,
  quantityKg,
  bagWeightKg,
  pricePerBag,
  quantityError,
  bagWeightError,
  priceError,
  hasCalculatorQuantity,
  onQuantityChange,
  onBagWeightChange,
  onPriceChange,
}) {
  const quantity = quantityKg === "" ? "" : Number(quantityKg);
  const bagWeight = bagWeightKg === "" ? 0 : Number(bagWeightKg);
  const bagCount =
    quantity === "" || bagWeight <= 0
      ? ""
      : Number((quantity / bagWeight).toFixed(3));
  const quantityId = `${stage}-quantity`;
  const bagWeightId = `${stage}-bag-weight`;
  const bagCountId = `${stage}-bag-count`;
  const priceId = `${stage}-price`;

  return (
    <section className="cost-section" aria-labelledby={`${stage}-heading`}>
      <div className="cost-section-heading">
        <h3 id={`${stage}-heading`}>{title}</h3>
        <p>Enter the local bag price; no market price is prefilled.</p>
      </div>
      <div className="cost-grid">
        <CostField
          id={quantityId}
          label="Quantity required (kg)"
          value={quantityKg}
          onChange={onQuantityChange}
          error={quantityError}
          min="0"
          step="any"
        />
        <CostField
          id={bagCountId}
          label="Number of bags"
          value={bagCount}
          onChange={(value) =>
            onQuantityChange(
              value === "" ? "" : String(Number(value) * bagWeight)
            )
          }
          min="0"
          step="any"
          disabled={bagWeight <= 0}
        />
        <CostField
          id={bagWeightId}
          label="Bag weight (kg)"
          value={bagWeightKg}
          onChange={onBagWeightChange}
          error={bagWeightError}
          min="0"
          step="any"
        />
        <CostField
          id={priceId}
          label="Price per bag (MWK)"
          value={pricePerBag}
          onChange={onPriceChange}
          error={priceError}
          min="0"
          step="any"
        />
      </div>
      {hasCalculatorQuantity && (
        <p className="cost-source-note">
          Filled from your latest {stage === "basal" ? "basal" : "top-dressing"}{" "}
          fertiliser calculation. You can edit the quantity.
        </p>
      )}
    </section>
  );
}

function BudgetLine({ label, cents }) {
  return (
    <div className="budget-line">
      <dt>{label}</dt>
      <dd>{formatMWK(cents)}</dd>
    </div>
  );
}

export default function FarmInputCostCalculator() {
  const {
    calculatorResults,
    farmInputCostValues,
    setFarmInputCostValues,
  } = useCalculatorResults();
  const values =
    farmInputCostValues ?? createInitialValues(calculatorResults);
  const { errors, breakdown } = calculateFarmInputCosts(values);

  function updateValues(update) {
    setFarmInputCostValues((current) =>
      update(current ?? createInitialValues(calculatorResults))
    );
  }

  function updateField(key, value) {
    const linkedField = {
      seedQuantityKg: "seedQuantityFromCalculator",
      basalFertiliserQuantityKg: "basalQuantityFromCalculator",
      topDressingFertiliserQuantityKg: "topDressingQuantityFromCalculator",
    }[key];

    updateValues((current) => ({
      ...current,
      [key]: value,
      ...(linkedField ? { [linkedField]: false } : {}),
    }));
  }

  function resetValues() {
    setFarmInputCostValues(createInitialValues(calculatorResults));
  }

  const hasSeedQuantity = calculatorResults.seedKg !== null;
  const hasBasalQuantity = calculatorResults.basalFertiliserKg !== null;
  const hasTopDressingQuantity =
    calculatorResults.topDressingFertiliserKg !== null;

  return (
    <section
      className="farm-input-cost-calculator"
      aria-labelledby="farm-input-cost-title"
    >
      <div className="cost-heading">
        <div className="calculator-title-row">
          <span className="calculator-icon cost-page-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M15 8.5c-.6-.6-1.6-1-3-1-1.7 0-3 .8-3 2s1.3 2 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.4-.4-3-1" />
              <path d="M12 6v12" />
            </svg>
          </span>
          <div>
            <span className="cost-label">BUDGET PLANNER</span>
            <h2 id="farm-input-cost-title">Farm Input Cost Calculator</h2>
          </div>
        </div>
        <p>
          Estimate the money needed for maize seed, fertiliser, other inputs and
          labour. Empty amounts count as zero.
        </p>
      </div>

      <div className="cost-sections">
        <section className="cost-section" aria-labelledby="seed-cost-heading">
          <div className="cost-section-heading">
            <h3 id="seed-cost-heading">Seed costs</h3>
            <p>Enter the local price for each kilogram of seed.</p>
          </div>
          <div className="cost-grid">
            <CostField
              id="seed-quantity"
              label="Seed quantity required (kg)"
              value={values.seedQuantityKg}
              onChange={(value) => updateField("seedQuantityKg", value)}
              error={errors.seedQuantityKg}
              min="0"
              step="any"
            />
            <CostField
              id="seed-price"
              label="Price per kilogram (MWK)"
              value={values.seedPricePerKg}
              onChange={(value) => updateField("seedPricePerKg", value)}
              error={errors.seedPricePerKg}
              min="0"
              step="any"
            />
          </div>
          {hasSeedQuantity && (
            <p className="cost-source-note">
              Filled from your latest seed calculation. You can edit the
              quantity.
            </p>
          )}
        </section>

        <FertiliserCostSection
          title="Basal fertiliser costs"
          stage="basal"
          quantityKg={values.basalFertiliserQuantityKg}
          bagWeightKg={values.basalBagWeightKg}
          pricePerBag={values.basalPricePerBag}
          quantityError={errors.basalFertiliserQuantityKg}
          bagWeightError={errors.basalBagWeightKg}
          priceError={errors.basalPricePerBag}
          hasCalculatorQuantity={hasBasalQuantity}
          onQuantityChange={(value) =>
            updateField("basalFertiliserQuantityKg", value)
          }
          onBagWeightChange={(value) => updateField("basalBagWeightKg", value)}
          onPriceChange={(value) => updateField("basalPricePerBag", value)}
        />

        <FertiliserCostSection
          title="Top-dressing fertiliser costs"
          stage="top-dressing"
          quantityKg={values.topDressingFertiliserQuantityKg}
          bagWeightKg={values.topDressingBagWeightKg}
          pricePerBag={values.topDressingPricePerBag}
          quantityError={errors.topDressingFertiliserQuantityKg}
          bagWeightError={errors.topDressingBagWeightKg}
          priceError={errors.topDressingPricePerBag}
          hasCalculatorQuantity={hasTopDressingQuantity}
          onQuantityChange={(value) =>
            updateField("topDressingFertiliserQuantityKg", value)
          }
          onBagWeightChange={(value) =>
            updateField("topDressingBagWeightKg", value)
          }
          onPriceChange={(value) =>
            updateField("topDressingPricePerBag", value)
          }
        />

        <section
          className="cost-section"
          aria-labelledby="additional-inputs-heading"
        >
          <div className="cost-section-heading">
            <h3 id="additional-inputs-heading">Additional input costs</h3>
            <p>Optional estimates for other farm inputs.</p>
          </div>
          <div className="cost-grid">
            {values.additionalInputs.map((input, index) => (
              <div className="cost-extra-row" key={`additional-${index}`}>
                <CostField
                  id={`additional-description-${index}`}
                  label="Input description"
                  value={input.description}
                  type="text"
                  placeholder="Describe this input"
                  onChange={(value) =>
                    updateValues((current) => ({
                      ...current,
                      additionalInputs: current.additionalInputs.map(
                        (currentInput, currentIndex) =>
                          currentIndex === index
                            ? { ...currentInput, description: value }
                            : currentInput
                      ),
                    }))
                  }
                />
                <CostField
                  id={`additional-cost-${index}`}
                  label="Estimated cost (MWK)"
                  value={input.cost}
                  onChange={(value) =>
                    updateValues((current) => ({
                      ...current,
                      additionalInputs: current.additionalInputs.map(
                        (currentInput, currentIndex) =>
                          currentIndex === index
                            ? { ...currentInput, cost: value }
                            : currentInput
                      ),
                    }))
                  }
                  error={errors[`additionalInputs.${index}.cost`]}
                  min="0"
                  step="any"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="cost-section" aria-labelledby="labour-costs-heading">
          <div className="cost-section-heading">
            <h3 id="labour-costs-heading">Labour costs</h3>
            <p>Optional costs for work on your farm.</p>
          </div>
          <div className="cost-grid">
            {labourFields.map(({ key, label }) => (
              <CostField
                key={key}
                id={`labour-${key}`}
                label={`${label} (MWK)`}
                value={values.labourCosts[key]}
                onChange={(value) =>
                  updateValues((current) => ({
                    ...current,
                    labourCosts: {
                      ...current.labourCosts,
                      [key]: value,
                    },
                  }))
                }
                error={errors[`labourCosts.${key}`]}
                min="0"
                step="any"
              />
            ))}
          </div>
        </section>
      </div>

      <section className="budget-summary" aria-labelledby="budget-summary-title">
        <div className="budget-summary-heading">
          <div>
            <span className="cost-label">YOUR ESTIMATE</span>
            <h3 id="budget-summary-title">Budget summary</h3>
          </div>
          <button
            className="cost-reset-button"
            type="button"
            onClick={resetValues}
          >
            Reset
          </button>
        </div>
        {breakdown ? (
          <>
            <dl className="budget-breakdown" aria-live="polite">
              <BudgetLine label="Seed cost" cents={breakdown.seedCost} />
              <BudgetLine
                label="Basal fertiliser cost"
                cents={breakdown.basalFertiliserCost}
              />
              <BudgetLine
                label="Top-dressing fertiliser cost"
                cents={breakdown.topDressingFertiliserCost}
              />
              <BudgetLine
                label="Additional input costs"
                cents={breakdown.additionalInputsCost}
              />
              <BudgetLine label="Labour costs" cents={breakdown.labourCost} />
            </dl>
            <div className="budget-grand-total" aria-live="polite">
              <span>Total estimated budget</span>
              <strong>{formatMWK(breakdown.grandTotal)}</strong>
            </div>
          </>
        ) : (
          <p className="budget-validation-message" role="alert">
            Correct the highlighted values to see your budget total.
          </p>
        )}
      </section>

      <p className="cost-disclaimer">
        This is an estimate based on the quantities and local prices you enter.
        Check current prices with suppliers before making purchases.
      </p>
    </section>
  );
}
