import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { useEnginesQuery } from "hooks/EnginesQuery";
import React, { useContext, useEffect } from "react";

export default function EngineSelector() {
  const { apiKey } = useContext(ApiKeyContext);
  const { engine, setEngine } = useContext(EngineContext);
  const engines = useEnginesQuery(apiKey);

  useEffect(() => {
    if (!setEngine) return;

    if (!engines) {
      setEngine?.(undefined);
      return;
    }

    setEngine(engines[0]);
  }, [engines, setEngine]);

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <div>Engine:</div>
      <select
        value={engine?.engine_id ?? 0}
        disabled={!engine?.engine_id}
        onChange={(e) =>
          setEngine?.(engines?.find((_e) => _e.engine_id === e.target.value))
        }
      >
        {engines ? (
          engines.map((e) => (
            <option key={e.engine_id} value={e.engine_id}>
              {e.engine_name ?? e.engine_id}
            </option>
          ))
        ) : apiKey ? (
          <option value={0} disabled>
            No engines available
          </option>
        ) : (
          <option value={0} disabled>
            No API key
          </option>
        )}
      </select>
    </div>
  );
}
