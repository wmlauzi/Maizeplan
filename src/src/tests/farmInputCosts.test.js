import { describe, expect, it } from "vitest";
import {
  calculateFarmInputCosts,
  formatMWK,
} from "../utils/farmInputCosts";

function emptyBudget() {
  return {
    seedQuantityKg: "",
    seedPricePerKg: "",
    basalFertiliserQuantityKg: "",
    basalBagWeightKg: "",
    basalPricePerBag: "",
    topDressingFertiliserQuantityKg: "",
    topDressingBagWeightKg: "",
    topDressingPricePerBag: "",
    additionalInputs: [
      { description: "Herbicides", cost: "" },
      { description: "Pesticides", cost: "" },
      { description: "Other", cost: "" },
    ],
    labourCosts: {
      landPreparation: "",
      planting: "",
      fertiliserApplication: "",
      weeding: "",
      other: "",
    },
  };
}

describe("Farm input cost calculations", () => {
  it("calculates every cost category and the grand total", () => {
    const values = {
      ...emptyBudget(),
      seedQuantityKg: "10",
      seedPricePerKg: "100",
      basalFertiliserQuantityKg: "250",
      basalBagWeightKg: "50",
      basalPricePerBag: "30000",
      topDressingFertiliserQuantityKg: "125",
      topDressingBagWeightKg: "50",
      topDressingPricePerBag: "40000",
      additionalInputs: [
        { description: "Herbicides", cost: "5000" },
        { description: "Pesticides", cost: "" },
        { description: "Other", cost: "2500" },
      ],
      labourCosts: {
        landPreparation: "20000",
        planting: "5000",
        fertiliserApplication: "4000",
        weeding: "7000",
        other: "1000",
      },
    };

    expect(calculateFarmInputCosts(values)).toEqual({
      errors: {},
      breakdown: {
        seedCost: 100000,
        basalFertiliserCost: 15000000,
        topDressingFertiliserCost: 10000000,
        additionalInputsCost: 750000,
        labourCost: 3700000,
        grandTotal: 29550000,
      },
    });
  });

  it("treats empty amounts and explicit zeros as zero", () => {
    const values = emptyBudget();
    values.seedQuantityKg = "0";
    values.seedPricePerKg = "0";
    values.labourCosts.weeding = "0";

    expect(calculateFarmInputCosts(values)).toEqual({
      errors: {},
      breakdown: {
        seedCost: 0,
        basalFertiliserCost: 0,
        topDressingFertiliserCost: 0,
        additionalInputsCost: 0,
        labourCost: 0,
        grandTotal: 0,
      },
    });
  });

  it("rejects negative values and prevents a misleading total", () => {
    const values = emptyBudget();
    values.seedPricePerKg = "-1";
    values.labourCosts.planting = "-25";

    const result = calculateFarmInputCosts(values);

    expect(result.breakdown).toBeNull();
    expect(result.errors.seedPricePerKg).toMatch(/positive number/);
    expect(result.errors["labourCosts.planting"]).toMatch(/positive number/);
  });

  it("requires a positive bag weight when fertiliser quantity is entered", () => {
    const values = emptyBudget();
    values.basalFertiliserQuantityKg = "100";
    values.basalBagWeightKg = "0";

    expect(calculateFarmInputCosts(values).errors.basalBagWeightKg).toMatch(
      /greater than zero/
    );
  });

  it("formats MWK values with thousands separators", () => {
    expect(formatMWK(123456789)).toBe("MWK 1,234,567.89");
  });
});
