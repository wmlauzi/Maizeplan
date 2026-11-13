
import { describe, it, expect } from "vitest";

import {
  acresToHectares,
  hectaresToAcres,
  calculatePlantPopulation,
  calculateSeedRequirement,
  calculateFertiliserRequirement,
  getFertiliserRecommendation,
  estimateYield,
} from "../utils/maizeCalculations";

describe("iNest Maize Planner - Calculation Engine", () => {

  describe("Area conversions", () => {
    it("converts hectares to acres", () => {
      expect(hectaresToAcres(1)).toBeCloseTo(2.47105, 4);
    });

    it("converts acres to hectares", () => {
      expect(acresToHectares(2.47105)).toBeCloseTo(1, 4);
    });
  });

  describe("Plant population", () => {
    it("calculates population using 90cm x 40cm spacing and 2 plants", () => {
      const result = calculatePlantPopulation({
        rowSpacingCm: 90,
        plantSpacingCm: 40,
        plantsPerStation: 2,
        fieldAreaHa: 1,
      });

      expect(result.plantsPerHa).toBe(55556);
      expect(result.totalPlants).toBe(55556);
    });

    it("calculates 50,000 plants per hectare using 100cm x 40cm spacing and 2 plants", () => {
      const result = calculatePlantPopulation({
        rowSpacingCm: 100,
        plantSpacingCm: 40,
        plantsPerStation: 2,
        fieldAreaHa: 1,
      });

      expect(result.plantsPerHa).toBe(50000);
      expect(result.totalPlants).toBe(50000);
    });

    it("calculates total plants for multiple hectares", () => {
      const result = calculatePlantPopulation({
        rowSpacingCm: 90,
        plantSpacingCm: 40,
        plantsPerStation: 2,
        fieldAreaHa: 2,
      });

      expect(result.totalPlants).toBe(111111);
    });

    it("rejects zero spacing", () => {
      expect(() =>
        calculatePlantPopulation({
          rowSpacingCm: 0,
          plantSpacingCm: 40,
        })
      ).toThrow();
    });
  });

  describe("Seed requirements", () => {
    it("calculates seed requirements using medium seed", () => {
      const result = calculateSeedRequirement({
        fieldAreaHa: 1,
        targetPopulationPerHa: 50000,
        seedSize: "medium",
      });

      expect(result.requiredEstablishedPlants).toBe(50000);
      expect(result.seedKg).toBeCloseTo(26.38);
      expect(result.bagsToPurchase).toBe(2);
    });

    it.each([37000, 40000, 45000, 50000, 55000])(
      "calculates seed requirements for a target population of %i plants per hectare",
      (targetPopulationPerHa) => {
        const result = calculateSeedRequirement({
          fieldAreaHa: 1,
          targetPopulationPerHa,
          seedSize: "medium",
        });

        expect(result.requiredEstablishedPlants).toBe(targetPopulationPerHa);
        expect(result.seedKg).toBeCloseTo(
          targetPopulationPerHa / (0.95 * 0.95 * 2100),
          2
        );
      }
    );

    it("supports small seed", () => {
      const result = calculateSeedRequirement({
        fieldAreaHa: 1,
        targetPopulationPerHa: 50000,
        seedSize: "small",
      });

      expect(result.seedKg).toBeCloseTo(23.08);
    });

    it("rejects invalid germination rates", () => {
      expect(() =>
        calculateSeedRequirement({
          fieldAreaHa: 1,
          targetPopulationPerHa: 50000,
          germinationRate: 110,
        })
      ).toThrow();
    });
  });

  describe("Fertiliser calculations", () => {
    it("calculates total fertiliser and 50kg bags", () => {
      const result = calculateFertiliserRequirement({
        fieldAreaHa: 1.5,
        rateKgPerHa: 200,
      });

      expect(result.totalKg).toBe(300);
      expect(result.bagsRequired).toBe(6);
      expect(result.fullBagsToPurchase).toBe(6);
    });

    it("rounds purchase quantity up to whole bags", () => {
      const result = calculateFertiliserRequirement({
        fieldAreaHa: 1,
        rateKgPerHa: 125,
      });

      expect(result.totalKg).toBe(125);
      expect(result.bagsRequired).toBe(2.5);
      expect(result.fullBagsToPurchase).toBe(3);
    });

    it("returns the correct recommendation for a 4 tonne target", () => {
      const result = getFertiliserRecommendation(4);

      expect(result.basalKgPerHa).toEqual({
        min: 100,
        max: 250,
      });

      expect(result.topDressingKgPerHa).toEqual({
        min: 100,
        max: 250,
      });
    });
  });

  describe("Yield estimation", () => {
    it("estimates yield using a 20m2 sample", () => {
      const result = estimateYield({
        grainWeightKg: 2,
        sampleAreaM2: 20,
        moisturePercentage: 12.5,
        fieldAreaHa: 1,
      });

      expect(result.yieldKgPerHa).toBe(1000);
      expect(result.yieldTonnesPerHa).toBe(1);
      expect(result.estimated50kgBags).toBe(20);
    });

    it("corrects grain weight for moisture", () => {
      const result = estimateYield({
        grainWeightKg: 2,
        sampleAreaM2: 20,
        moisturePercentage: 20,
        fieldAreaHa: 1,
      });

      expect(result.correctedSampleWeightKg).toBeCloseTo(1.83, 2);
    });
  });

});


import {
  calculateCupFertiliserRequirement,
} from "../utils/maizeCalculations";

describe("Fertiliser cup calculator", () => {
  it("calculates basal fertiliser requirements", () => {
    const result = calculateCupFertiliserRequirement({
      applicationType: "basal",
      rowSpacingCm: 90,
      stationSpacingCm: 60,
      cupSize: 12,
      fieldAreaHa: 2,
    });

    expect(result.rateKgPerHa).toBe(250);
    expect(result.totalKg).toBe(500);
    expect(result.totalBags).toBe(10);
  });

  it("calculates top dressing requirements", () => {
    const result = calculateCupFertiliserRequirement({
      applicationType: "topDressing",
      rowSpacingCm: 90,
      stationSpacingCm: 60,
      cupSize: 12,
      fieldAreaHa: 1,
    });

    expect(result.rateKgPerHa).toBe(225);
    expect(result.totalBags).toBe(4.5);
  });

  it("rejects unsupported planting spacing", () => {
    expect(() =>
      calculateCupFertiliserRequirement({
        applicationType: "basal",
        rowSpacingCm: 80,
        stationSpacingCm: 50,
        cupSize: 12,
      })
    ).toThrow("Unsupported planting spacing.");
  });
});

