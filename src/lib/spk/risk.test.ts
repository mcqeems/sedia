import { describe, expect, test } from "bun:test";
import { computeRiskScore, fromDashboardData } from "./risk";

describe("computeRiskScore", () => {
  test("all zero inputs produce Aman score 0", () => {
    expect(computeRiskScore({})).toEqual({
      score: 0,
      level: "Aman",
      breakdown: [
        expect.objectContaining({ criterion: "Curah Hujan", normalized: 0 }),
        expect.objectContaining({
          criterion: "Kecepatan Angin",
          normalized: 0,
        }),
        expect.objectContaining({
          criterion: "Magnitudo Gempa",
          normalized: 0,
        }),
        expect.objectContaining({
          criterion: "Peringatan Dini",
          normalized: 0,
        }),
      ],
    });
  });

  test("all criteria at cap produce score 100 with level Awas", () => {
    const result = computeRiskScore({
      rainH1Mm: 50,
      windSpeedMps: 25,
      gempaMagnitude: 8,
      alertCount: 3,
    });
    expect(result.score).toBe(100);
    expect(result.level).toBe("Awas");
  });

  test("rain alone at half cap contributes 15%", () => {
    const result = computeRiskScore({ rainH1Mm: 25 });
    expect(result.score).toBe(15);
    expect(result.level).toBe("Aman");
  });

  test("raw values above cap are clamped to 1", () => {
    const result = computeRiskScore({ rainH1Mm: 999 });
    expect(result.breakdown[0].normalized).toBe(1);
  });

  test("breakdown contributions sum to score", () => {
    const result = computeRiskScore({ rainH1Mm: 10, windSpeedMps: 5 });
    const sum = result.breakdown.reduce((acc, c) => acc + c.contribution, 0);
    expect(Math.round(sum * 100)).toBe(result.score);
  });

  test("level thresholds", () => {
    expect(computeRiskScore({ alertCount: 1 }).level).toBe("Aman");
    expect(computeRiskScore({ alertCount: 3 }).level).toBe("Aman");
    expect(computeRiskScore({ rainH1Mm: 42 }).level).toBe("Waspada");
    expect(computeRiskScore({ rainH1Mm: 50, windSpeedMps: 25 }).level).toBe(
      "Siaga",
    );
    expect(
      computeRiskScore({
        rainH1Mm: 50,
        windSpeedMps: 25,
        gempaMagnitude: 8,
      }).level,
    ).toBe("Awas");
  });
});

describe("fromDashboardData", () => {
  test("extracts values from raw API objects", () => {
    const result = fromDashboardData({
      cuaca: { rain: { "1h": 40 }, wind: { speed: 20 } },
      gempaInfo: { Infogempa: { gempa: { Magnitude: "6.5" } } },
      peringatanCuaca: [{ title: "a" }, { title: "b" }],
    } as Parameters<typeof fromDashboardData>[0]);
    expect(result.breakdown.map((c) => c.criterion)).toEqual([
      "Curah Hujan",
      "Kecepatan Angin",
      "Magnitudo Gempa",
      "Peringatan Dini",
    ]);
    expect(result.breakdown[0].raw).toBe(40);
    expect(result.breakdown[1].raw).toBe(20);
    expect(result.breakdown[2].raw).toBe(6.5);
    expect(result.breakdown[3].raw).toBe(2);
  });

  test("fallbacks for rain when rain[1h] is omitted by API", () => {
    // 3h fallback
    const res3h = fromDashboardData({
      cuaca: { rain: { "3h": 15 }, wind: { speed: 5 } },
    } as Parameters<typeof fromDashboardData>[0]);
    expect(res3h.breakdown[0].raw).toBe(5);

    // Weather condition ID fallback (e.g. 502 Heavy Rain)
    const resCondition = fromDashboardData({
      cuaca: { weather: [{ id: 502 }], wind: { speed: 5 } },
    } as Parameters<typeof fromDashboardData>[0]);
    expect(resCondition.breakdown[0].raw).toBe(25);
  });

  test("missing data contributes zero", () => {
    expect(computeRiskScore({}).score).toBe(0);
    expect(fromDashboardData({}).score).toBe(0);
  });
});
