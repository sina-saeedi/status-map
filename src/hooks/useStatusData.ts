import {useEffect, useState} from "react";
import targetList from "data/targets.json";
import {DATA_BASE_URL} from "../config";
import type {HistoryPoint, Status, Target} from "../types";

interface LatestFile {
  updatedAt: string;
  targets: {id: string; status: Status; latencyMs: number | null}[];
}

const REFRESH_MS = 60_000;

export function useStatusData() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [history, setHistory] = useState<Record<string, HistoryPoint[]>>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [latestRes, historyRes] = await Promise.all([
          fetch(`${DATA_BASE_URL}/latest.json`),
          fetch(`${DATA_BASE_URL}/history.json`),
        ]);
        if (!latestRes.ok || !historyRes.ok)
          throw new Error("Failed to load data");

        const latest: LatestFile = await latestRes.json();
        const historyData = await historyRes.json();
        if (cancelled) return;

        // join the static target list with the latest results by id
        const byId = new Map(latest.targets.map((r) => [r.id, r]));
        const merged: Target[] = [];
        for (const t of targetList) {
          const r = byId.get(t.id);
          if (r) merged.push({...t, status: r.status, latencyMs: r.latencyMs});
        }

        setTargets(merged);
        setHistory(historyData);
        setUpdatedAt(latest.updatedAt);
        setError(null);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unknown error");
      }
    }

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return {targets, history, updatedAt, error};
}
