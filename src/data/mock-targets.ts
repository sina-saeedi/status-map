import type {Target} from "../types";

export const MOCK_TARGETS: Target[] = [
  {
    id: "frankfurt",
    name: "AWS Frankfurt",
    lat: 50.11,
    lng: 8.68,
    status: "up",
    latencyMs: 84,
  },
  {
    id: "virginia",
    name: "AWS N. Virginia",
    lat: 38.95,
    lng: -77.45,
    status: "up",
    latencyMs: 31,
  },
  {
    id: "tokyo",
    name: "AWS Tokyo",
    lat: 35.68,
    lng: 139.69,
    status: "slow",
    latencyMs: 412,
  },
  {
    id: "sydney",
    name: "AWS Sydney",
    lat: -33.87,
    lng: 151.21,
    status: "up",
    latencyMs: 190,
  },
  {
    id: "saopaulo",
    name: "AWS São Paulo",
    lat: -23.55,
    lng: -46.63,
    status: "down",
    latencyMs: null,
  },
];
