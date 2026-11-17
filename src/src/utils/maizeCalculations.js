/**
 * iNest Maize Planner
 * Agricultural Calculation Engine
 *
 * Units:
 * - Area: hectares and acres
 * - Spacing: centimetres
 * - Fertiliser: kilograms and 50kg bags
 * - Seed: kilograms
 */

// Conversion constants
export const CONSTANTS = {
  SQ_METRES_PER_HECTARE: 10000,
  SQ_METRES_PER_ACRE: 4046.8564224,
  ACRES_PER_HECTARE: 2.4710538,
  FERTILISER_BAG_KG: 50,
};

// Validate positive numeric inputs
function requirePositive(value, name) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(`${name} must be a positive number.`);
  }
}

// Validate percentage inputs
function requirePercentage(value, name) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    throw new Error(`${name} must be between 0 and 100.`);
  }
}

// 1. AREA CONVERSIONS

export function acresToHectares(acres) {
  requirePositive(acres, "Acres");
  return acres / CONSTANTS.ACRES_PER_HECTARE;
}

export function hectaresToAcres(hectares) {
  requirePositive(hectares, "Hectares");
  return hectares * CONSTANTS.ACRES_PER_HECTARE;
}

// 2. PLANT POPULATION

export function calculatePlantPopulation({
  rowSpacingCm,
  plantSpacingCm,
  plantsPerStation = 1,
  fieldAreaHa = 1,
}) {
  requirePositive(rowSpacingCm, "Row spacing");
  requirePositive(plantSpacingCm, "Plant spacing");
  requirePositive(plantsPerStation, "Plants per station");
  requirePositive(fieldAreaHa, "Field area");

  if (!Number.isInteger(plantsPerStation)) {
    throw new Error("Plants per station must be a whole number.");
  }

  const rowSpacingM = rowSpacingCm / 100;
  const plantSpacingM = plantSpacingCm / 100;

  const populationPerHa =
    (CONSTANTS.SQ_METRES_PER_HECTARE /
      (rowSpacingM * plantSpacingM)) *
    plantsPerStation;

  return {
    plantsPerHa: Math.round(populationPerHa),
    totalPlants: Math.round(populationPerHa * fieldAreaHa),
    fieldAreaHa,
    rowSpacingCm,
    plantSpacingCm,
    plantsPerStation,
  };
}

// 3. SEED REQUIREMENT CALCULATOR

export const SEED_SIZES = {
  large: 1600,
  medium: 2100,
  small: 2400,
};

export function calculateSeedRequirement({
  fieldAreaHa,
  targetPopulationPerHa,
  seedSize = "medium",
  seedsPerKg,
  seedsPerStation = 1,
  germinationRate = 95,
  fieldLossRate = 5,
}) {
  requirePositive(fieldAreaHa, "Field area");
  requirePositive(targetPopulationPerHa, "Target population");
  requirePositive(seedsPerStation, "Seeds per planting station");

  if (![1, 2, 3].includes(seedsPerStation)) {
    throw new Error("Seeds per planting station must be 1, 2, or 3.");
  }

  requirePercentage(germinationRate, "Germination rate");
  requirePercentage(fieldLossRate, "Field loss rate");

  const actualSeedsPerKg = seedsPerKg ?? SEED_SIZES[seedSize];

  requirePositive(actualSeedsPerKg, "Seeds per kilogram");

  if (germinationRate === 0 || fieldLossRate === 100) {
    throw new Error("Effective seed survival must be greater than zero.");
  }

  const survivalRate =
    (germinationRate / 100) *
    ((100 - fieldLossRate) / 100);

  const requiredEstablishedPlants =
    fieldAreaHa * targetPopulationPerHa;

  const seedsRequired =
    (requiredEstablishedPlants / survivalRate) * seedsPerStation;

  const seedKg = seedsRequired / actualSeedsPerKg;

  return {
    fieldAreaHa,
    requiredEstablishedPlants: Math.ceil(requiredEstablishedPlants),
    survivalRate,
    seedsRequired: Math.ceil(seedsRequired),
    seedKg: Number(seedKg.toFixed(2)),
    bags25kg: Number((seedKg / 25).toFixed(2)),
    bagsToPurchase: Math.ceil(seedKg / 25),
    seedSize,
    seedsPerKg: actualSeedsPerKg,
    seedsPerStation,
  };
}

// 4. FERTILISER REQUIREMENT CALCULATOR

export function calculateFertiliserRequirement({
  fieldAreaHa,
  rateKgPerHa,
  bagSizeKg = 50,
}) {
  requirePositive(fieldAreaHa, "Field area");
  requirePositive(rateKgPerHa, "Fertiliser rate");
  requirePositive(bagSizeKg, "Bag size");

  const totalKg = fieldAreaHa * rateKgPerHa;

  return {
    fieldAreaHa,
    rateKgPerHa,
    totalKg: Number(totalKg.toFixed(2)),
    bagsRequired: Number((totalKg / bagSizeKg).toFixed(2)),
    fullBagsToPurchase: Math.ceil(totalKg / bagSizeKg),
    bagSizeKg,
  };
}

// 5. GUIDE-BASED FERTILISER RECOMMENDATIONS

export const FERTILISER_GUIDE = [
  {
    minYield: 0,
    maxYield: 3,
    basal: { min: 0, max: 150 },
    topDressing: { min: 50, max: 150 },
  },
  {
    minYield: 3,
    maxYield: 5,
    basal: { min: 100, max: 250 },
    topDressing: { min: 100, max: 250 },
  },
  {
    minYield: 5,
    maxYield: 8,
    basal: { min: 250, max: 350 },
    topDressing: { min: 250, max: 350 },
  },
  {
    minYield: 8,
    maxYield: Infinity,
    basal: { min: 300, max: 600 },
    topDressing: { min: 250, max: 500 },
  },
];

export function getFertiliserRecommendation(targetYieldTonnesPerHa) {
  requirePositive(targetYieldTonnesPerHa, "Yield target");

  const recommendation = FERTILISER_GUIDE.find(
    (item) =>
      targetYieldTonnesPerHa >= item.minYield &&
      targetYieldTonnesPerHa < item.maxYield
  );

  if (!recommendation) {
    throw new Error("No fertiliser recommendation found.");
  }

  return {
    yieldTarget: targetYieldTonnesPerHa,
    basalKgPerHa: recommendation.basal,
    topDressingKgPerHa: recommendation.topDressing,
    bagSizeKg: 50,
    source: "Malawi Maize Growers Guide",
    note:
      "These are general guide ranges, not a substitute for soil testing or locally validated recommendations.",
  };
}

// 6. MAIZE YIELD ESTIMATION
// Based on the guide's measured 20 square metre sampling method.

export function estimateYield({
  grainWeightKg,
  sampleAreaM2 = 20,
  moisturePercentage,
  fieldAreaHa = 1,
}) {
  requirePositive(grainWeightKg, "Grain weight");
  requirePositive(sampleAreaM2, "Sample area");
  requirePositive(fieldAreaHa, "Field area");
  requirePercentage(moisturePercentage, "Moisture percentage");

  const correctedWeight =
    grainWeightKg *
    ((100 - moisturePercentage) / (100 - 12.5));

  const yieldKgPerHa =
    (correctedWeight / sampleAreaM2) *
    CONSTANTS.SQ_METRES_PER_HECTARE;

  const totalFieldKg = yieldKgPerHa * fieldAreaHa;

  return {
    correctedSampleWeightKg: Number(correctedWeight.toFixed(2)),
    yieldKgPerHa: Number(yieldKgPerHa.toFixed(2)),
    yieldTonnesPerHa: Number((yieldKgPerHa / 1000).toFixed(2)),
    totalFieldKg: Number(totalFieldKg.toFixed(2)),
    totalFieldTonnes: Number((totalFieldKg / 1000).toFixed(2)),
    estimated50kgBags: Number((totalFieldKg / 50).toFixed(2)),
    moistureStandard: "12.5%",
  };
}

// 7. FERTILISER CUP CALCULATOR

export const FERTILISER_CUP_SIZES = [5, 8, 12, 16, 22];

export const FERTILISER_CUP_TABLES = {
  basal: {
    "100x50": [125, 200, 275, 375, 525],
    "90x60": [100, 175, 250, 350, 475],
    "90x50": [125, 250, 300, 425, 575],
    "90x30": [200, 350, 525, 700, 950],
    "75x60": [125, 200, 300, 425, 575],
    "50x50": [250, 375, 550, 750, 1050],
  },
  topDressing: {
    "100x50": [100, 150, 250, 325, 450],
    "90x60": [100, 150, 225, 300, 400],
    "90x50": [100, 175, 250, 350, 500],
    "90x30": [200, 300, 450, 600, 800],
    "75x60": [100, 175, 250, 350, 500],
    "50x50": [200, 325, 500, 650, 875],
  },
};

export function calculateCupFertiliserRequirement({
  applicationType,
  rowSpacingCm,
  stationSpacingCm,
  cupSize,
  fieldAreaHa = 1,
}) {
  if (!["basal", "topDressing"].includes(applicationType)) {
    throw new Error("Invalid fertiliser application type.");
  }

  if (!Number.isFinite(fieldAreaHa) || fieldAreaHa <= 0) {
    throw new Error("Field area must be greater than zero.");
  }

  const cupIndex = FERTILISER_CUP_SIZES.indexOf(cupSize);
  if (cupIndex === -1) {
    throw new Error("Unsupported fertiliser cup size.");
  }

  const spacingKey = `${rowSpacingCm}x${stationSpacingCm}`;
  let rates = FERTILISER_CUP_TABLES[applicationType][spacingKey];

  // FALLBACK: If the exact spacing isn't in the hardcoded table, calculate it dynamically
  if (!rates) {
    // 1. Calculate the area of a single plant station in square meters
    const areaPerPlantM2 = (rowSpacingCm / 100) * (stationSpacingCm / 100);
    
    // 2. Calculate how many stations fit in one hectare
    const stationsPerHa = CONSTANTS.SQ_METRES_PER_HECTARE / areaPerPlantM2;

    // 3. Define exact grams of fertiliser per cup based on the 100x50 baseline table
    const gramsPerCup = applicationType === "basal" 
      ? [6.25, 10, 13.75, 18.75, 26.25]
      : [5, 7.5, 12.5, 16.25, 22.5];

    const gramsPerStation = gramsPerCup[cupIndex];
    
    // 4. Calculate the final rate in kg/ha
    const calculatedRate = (stationsPerHa * gramsPerStation) / 1000;
    const rateKgPerHa = Math.round(calculatedRate);

    const totalKg = rateKgPerHa * fieldAreaHa;

    return {
      rateKgPerHa,
      totalKg: Number(totalKg.toFixed(2)),
      bagsPerHa: Number((rateKgPerHa / 50).toFixed(2)),
      totalBags: Number((totalKg / 50).toFixed(2)),
    };
  }

  // STANDARD PATH: Use the hardcoded table data
  const rateKgPerHa = rates[cupIndex];
  const totalKg = rateKgPerHa * fieldAreaHa;

  return {
    rateKgPerHa,
    totalKg: Number(totalKg.toFixed(2)),
    bagsPerHa: Number((rateKgPerHa / 50).toFixed(2)),
    totalBags: Number((totalKg / 50).toFixed(2)),
  };
}