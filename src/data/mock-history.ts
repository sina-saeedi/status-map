import type {HistoryPoint} from "../types";
import {MOCK_TARGETS} from "./mock-targets";

function generateHistory(base: number | null): HistoryPoint[] {
  const now = Date.now();
  // 144 points = 24 hours of checks, one every 10 minutes
  return Array.from({length: 144}, (_, i) => {
    const t = new Date(now - (143 - i) * 10 * 60 * 1000).toISOString();
    const latencyMs =
      base === null
        ? null
        : Math.round(base + (Math.random() - 0.5) * base * 0.4);
    const status =
      latencyMs === null ? "down" : latencyMs > 300 ? "slow" : "up";
    return {t, status, latencyMs};
  });
}

export const MOCK_HISTORY: Record<string, HistoryPoint[]> = Object.fromEntries(
  MOCK_TARGETS.map((t) => [t.id, generateHistory(t.latencyMs)]),
);
