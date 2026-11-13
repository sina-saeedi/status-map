import {useState} from "react";
import {StatusMap} from "@/components/status-map";
import {TargetPanel} from "@/components/target-panel";
import {useStatusData} from "./hooks/useStatusData";

export function App() {
  const {targets, history, updatedAt, error} = useStatusData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = targets.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="h-screen w-screen">
      <StatusMap
        targets={targets}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected && (
        <TargetPanel
          target={selected}
          history={history[selected.id] ?? []}
          onClose={() => setSelectedId(null)}
        />
      )}
      <div className="absolute bottom-4 left-4 z-10 rounded bg-black/70 px-3 py-1 text-xs text-white">
        {error
          ? `Error: ${error}`
          : updatedAt
            ? `Updated ${new Date(updatedAt).toLocaleTimeString()}`
            : "Loading…"}
      </div>
    </div>
  );
}

export default App;
