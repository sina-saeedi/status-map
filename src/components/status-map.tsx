import Map, {Marker} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type {Status, Target} from "../types";
import {setWorkerUrl} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

const STATUS_COLOR: Record<Status, string> = {
  up: "bg-green-500",
  slow: "bg-yellow-500",
  down: "bg-red-500",
};

interface Props {
  targets: Target[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StatusMap({targets, selectedId, onSelect}: Props) {
  return (
    <Map
      initialViewState={{longitude: 10, latitude: 25, zoom: 1.5}}
      mapStyle="https://tiles.openfreemap.org/styles/dark"
    >
      {targets.map((t) => (
        <Marker key={t.id} longitude={t.lng} latitude={t.lat}>
          <button
            aria-label={t.name}
            onClick={() => onSelect(t.id)}
            className={`h-4 w-4 rounded-full border-2 border-white ${STATUS_COLOR[t.status]} ${
              selectedId === t.id ? "ring-4 ring-white/40" : ""
            }`}
          />
        </Marker>
      ))}
    </Map>
  );
}
