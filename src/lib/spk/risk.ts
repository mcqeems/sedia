import type { WeatherAlert } from "@/lib/dashboard/bottoms/getPeringatanCuaca";
import type { EarthquakeData } from "@/lib/dashboard/tops/getGempa";
import type { WeatherResponse } from "@/lib/dashboard/tops/getWeather";

export type RiskLevel = "Aman" | "Waspada" | "Siaga" | "Awas";

export interface RiskInput {
  rainH1Mm?: number;
  windSpeedMps?: number;
  gempaMagnitude?: number;
  alertCount?: number;
}

export interface RiskBreakdown {
  criterion: string;
  raw: number;
  normalized: number;
  weight: number;
  contribution: number;
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  breakdown: RiskBreakdown[];
}

const CRITERIA: Array<{
  key: keyof RiskInput;
  criterion: string;
  cap: number;
  weight: number;
}> = [
  { key: "rainH1Mm", criterion: "Curah Hujan", cap: 50, weight: 0.3 },
  { key: "windSpeedMps", criterion: "Kecepatan Angin", cap: 25, weight: 0.2 },
  { key: "gempaMagnitude", criterion: "Magnitudo Gempa", cap: 8, weight: 0.3 },
  { key: "alertCount", criterion: "Peringatan Dini", cap: 3, weight: 0.2 },
];

export function riskLevelFromScore(score: number): RiskLevel {
  return score < 25
    ? "Aman"
    : score < 50
      ? "Waspada"
      : score < 75
        ? "Siaga"
        : "Awas";
}

export function computeRiskScore(input: RiskInput): RiskScore {
  const breakdown = CRITERIA.map(({ key, criterion, cap, weight }) => {
    const raw = Number(input[key] ?? 0);
    const normalized = Math.min(Math.max(raw, 0) / cap, 1);
    return {
      criterion,
      raw,
      normalized,
      weight,
      contribution: normalized * weight,
    };
  });

  const score =
    Math.round(
      breakdown.reduce((sum, c) => sum + c.contribution, 0) * 100 * 10,
    ) / 10;
  const level = riskLevelFromScore(score);

  return { score, level, breakdown };
}

export function fromDashboardData(input: {
  cuaca?: WeatherResponse | null;
  gempaInfo?: EarthquakeData | null;
  peringatanCuaca?: WeatherAlert | WeatherAlert[] | null;
}): RiskScore {
  const alerts = input.peringatanCuaca;
  const alertCount = Array.isArray(alerts) ? alerts.length : alerts ? 1 : 0;

  // 1. Direct 1-hour rain volume from OpenWeatherMap
  let rainMm = input.cuaca?.rain?.["1h"] ?? 0;

  // 2. Fallback to 3-hour rain volume if 1h is not present
  // biome-ignore lint/suspicious/noExplicitAny: OpenWeatherMap API may return 3h
  const rainObj = input.cuaca?.rain as any;
  if (!rainMm && rainObj?.["3h"]) {
    rainMm = Number(rainObj["3h"]) / 3;
  }

  // 3. Fallback to condition code (OpenWeatherMap weather[0].id) if rain property is omitted
  if (!rainMm && input.cuaca?.weather?.[0]) {
    const weatherId = input.cuaca.weather[0].id;
    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm (hujan lebat + petir)
      rainMm = 15;
    } else if (weatherId >= 500 && weatherId <= 504) {
      // Rain: 500 (light: 2.5mm), 501 (moderate: 7.5mm), 502-504 (heavy: 25mm)
      rainMm = weatherId === 500 ? 2.5 : weatherId === 501 ? 7.5 : 25;
    } else if (weatherId >= 300 && weatherId < 400) {
      // Drizzle / gerimis
      rainMm = 1.5;
    }
  }

  return computeRiskScore({
    rainH1Mm: rainMm,
    windSpeedMps: input.cuaca?.wind?.speed ?? 0,
    gempaMagnitude: Number(input.gempaInfo?.Infogempa?.gempa?.Magnitude ?? 0),
    alertCount,
  });
}
