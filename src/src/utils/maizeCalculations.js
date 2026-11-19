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
  germinationRate = 95,
  fieldLossRate = 5,
}) {
  requirePositive(fieldAreaHa, "Field area");
  requirePositive(targetPopulationPerHa, "Target population");
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

  const seedsRequired = requiredEstablishedPlants / survivalRate;

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

// 5. MALAWI AREA-SPECIFIC MAIZE FERTILISER REFERENCE
// Transcribed from Table 15, Guide to Agriculture Production (2021).
// Values are nutrient recommendations, NOT kg/ha of a single fertiliser product.

export const MALAWI_MAIZE_FERTILISER_GUIDE = [
  { add: "Karonga", area: "Chitipa District (all EPAs except Misuku)", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Karonga", area: "Misuku EPA, Chitipa", home: "69:21:0+4S", sale: null },
  { add: "Karonga", area: "Karonga District", home: "35:10:0+2S", sale: null },
  { add: "Mzuzu", area: "Mpherembe, Bwengu, Zombwe and Bolero EPAs, Mzimba", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Mzuzu", area: "Mhuju and Phoka/Nchenachena EPAs, Mzimba", home: "69:21:0+4S", sale: null },
  { add: "Mzuzu", area: "Central Mzimba", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Mzuzu", area: "South Mzimba", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Mzuzu", area: "Nkhata Bay District (all EPAs except Mpamba)", home: "69:21:0+4S", sale: null },
  { add: "Mzuzu", area: "Mpamba EPA, Nkhata Bay", home: "35:10:0+2S", sale: null },
  { add: "Kasungu", area: "All districts and EPAs", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Lilongwe", area: "All districts and EPAs", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Salima", area: "Salima District", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Salima", area: "Nkhunga and Linga EPAs, Nkhotakota", home: "69:21:0+4S", sale: null },
  { add: "Salima", area: "Zidyana and Mwansambo EPAs, Nkhotakota", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Salima", area: "Bwanje RDP", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Mangochi District", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Namwera", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Balaka: Ulongwe and Mpilisi EPAs", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Balaka: Bazale and Phalula EPAs and Rivi-Rivi Settlement Scheme", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Machinga District", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Zomba District (all EPAs except Mtubwi and Chingale)", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Machinga", area: "Mtubwi and Chingale EPAs, Zomba", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Blantyre", area: "Shire Highlands districts", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Blantyre", area: "Blantyre District (all EPAs except Lirangwe)", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Blantyre", area: "Lirangwe EPA, Blantyre", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Blantyre", area: "Thyolo, Mulanje and Phalombe districts", home: "92:21:0+4S", sale: "35:10:0+2S" },
  { add: "Blantyre", area: "Mwanza District", home: "69:21:0+4S", sale: "35:10:0+2S" },
  { add: "Shire Valley", area: "Chikhwawa and Nsanje districts", home: "35:10:0+4S", sale: null },
];

export function getMalawiMaizeFertiliserRecommendation({ add, area, productionPurpose }) {
  if (!add || !area || !["home", "sale"].includes(productionPurpose)) {
    throw new Error("Select an ADD, district/EPA area and production purpose.");
  }
  const entry = MALAWI_MAIZE_FERTILISER_GUIDE.find(
    (item) => item.add === add && item.area === area
  );
  if (!entry) throw new Error("No area-specific reference was found for that selection.");
  const nutrientRecommendation = entry[productionPurpose];
  return {
    ...entry,
    productionPurpose,
    nutrientRecommendation,
    available: nutrientRecommendation !== null,
    source: "Guide to Agriculture Production, 2021, Table 15",
    note: "This is a historical area-specific nutrient recommendation, not a product application rate. Confirm current advice with your local extension officer and a soil test before applying fertiliser.",
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
    "75x25": [333, 533, 733, 1000, 1400],
    "50x50": [250, 375, 550, 750, 1050],
  },
  topDressing: {
    "100x50": [100, 150, 250, 325, 450],
    "90x60": [100, 150, 225, 300, 400],
    "90x50": [100, 175, 250, 350, 500],
    "90x30": [200, 300, 450, 600, 800],
    "75x60": [100, 175, 250, 350, 500],
    "75x25": [267, 400, 667, 867, 1200],
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