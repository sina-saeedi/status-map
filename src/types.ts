export type Status = "up" | "slow" | "down";

export interface Target {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: Status;
  latencyMs: number | null;
}

export interface HistoryPoint {
  t: string; // ISO timestamp
  status: Status;
  latencyMs: number | null;
}
