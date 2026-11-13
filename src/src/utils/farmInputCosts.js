function readNonNegativeAmount(value, key, label, errors) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    errors[key] = `${label} must be zero or a positive number.`;
    return 0;
  }

  return amount;
}

function toCents(amount) {
  return Math.round(amount * 100);
}

export function calculateFarmInputCosts(values) {
  const errors = {};
  const seedQuantityKg = readNonNegativeAmount(
    values.seedQuantityKg,
    "seedQuantityKg",
    "Seed quantity",
    errors
  );
  const seedPricePerKg = readNonNegativeAmount(
    values.seedPricePerKg,
    "seedPricePerKg",
    "Seed price",
    errors
  );
  const basalQuantityKg = readNonNegativeAmount(
    values.basalFertiliserQuantityKg,
    "basalFertiliserQuantityKg",
    "Basal fertiliser quantity",
    errors
  );
  const basalBagWeightKg = readNonNegativeAmount(
    values.basalBagWeightKg,
    "basalBagWeightKg",
    "Basal fertiliser bag weight",
    errors
  );
  const basalPricePerBag = readNonNegativeAmount(
    values.basalPricePerBag,
    "basalPricePerBag",
    "Basal fertiliser price",
    errors
  );
  const topDressingQuantityKg = readNonNegativeAmount(
    values.topDressingFertiliserQuantityKg,
    "topDressingFertiliserQuantityKg",
    "Top-dressing fertiliser quantity",
    errors
  );
  const topDressingBagWeightKg = readNonNegativeAmount(
    values.topDressingBagWeightKg,
    "topDressingBagWeightKg",
    "Top-dressing fertiliser bag weight",
    errors
  );
  const topDressingPricePerBag = readNonNegativeAmount(
    values.topDressingPricePerBag,
    "topDressingPricePerBag",
    "Top-dressing fertiliser price",
    errors
  );

  if (basalQuantityKg > 0 && basalBagWeightKg === 0) {
    errors.basalBagWeightKg = "Enter a bag weight greater than zero.";
  }
  if (topDressingQuantityKg > 0 && topDressingBagWeightKg === 0) {
    errors.topDressingBagWeightKg = "Enter a bag weight greater than zero.";
  }

  const additionalInputCents = values.additionalInputs.map((input, index) =>
    toCents(
      readNonNegativeAmount(
        input.cost,
        `additionalInputs.${index}.cost`,
        input.description || "Additional input cost",
        errors
      )
    )
  );
  const labourCostCents = Object.entries(values.labourCosts).reduce(
    (costs, [key, value]) => {
      costs[key] = toCents(
        readNonNegativeAmount(value, `labourCosts.${key}`, key, errors)
      );
      return costs;
    },
    {}
  );

  if (Object.keys(errors).length > 0) {
    return { errors, breakdown: null };
  }

  const seedCost = toCents(seedQuantityKg * seedPricePerKg);
  const basalFertiliserCost =
    basalBagWeightKg > 0
      ? toCents((basalQuantityKg / basalBagWeightKg) * basalPricePerBag)
      : 0;
  const topDressingFertiliserCost =
    topDressingBagWeightKg > 0
      ? toCents(
          (topDressingQuantityKg / topDressingBagWeightKg) *
            topDressingPricePerBag
        )
      : 0;
  const additionalInputsCost = additionalInputCents.reduce(
    (total, cost) => total + cost,
    0
  );
  const labourCost = Object.values(labourCostCents).reduce(
    (total, cost) => total + cost,
    0
  );

  return {
    errors,
    breakdown: {
      seedCost,
      basalFertiliserCost,
      topDressingFertiliserCost,
      additionalInputsCost,
      labourCost,
      grandTotal:
        seedCost +
        basalFertiliserCost +
        topDressingFertiliserCost +
        additionalInputsCost +
        labourCost,
    },
  };
}

export function formatMWK(cents) {
  return `MWK ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)}`;
}
