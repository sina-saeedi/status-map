import {useState} from "react";
import {StatusMap} from "@/components/status-map";
import {TargetPanel} from "@/components/target-panel";
import {MOCK_TARGETS} from "@/data/mock-targets";
import {MOCK_HISTORY} from "./data/mock-history";

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = MOCK_TARGETS.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="h-screen w-screen">
      <StatusMap
        targets={MOCK_TARGETS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected && (
        <TargetPanel
          target={selected}
          history={MOCK_HISTORY[selected.id]}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

export default App;
