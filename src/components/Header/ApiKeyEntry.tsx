import Button from "components/Button";
import { ApiKeyContext } from "contexts/ApiKeyContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { COLORS } from "styles/colors";

const storageKey = "sepanana_api_key";

export default function ApiKeyEntry() {
  const { apiKey, setApiKey } = useContext(ApiKeyContext);
  const [isSaved, setIsSaved] = useState<boolean>();

  useEffect(() => {
    const savedKey = localStorage.getItem(storageKey);

    if (savedKey) setApiKey?.(savedKey);
  }, [setApiKey]);

  useEffect(() => {
    const savedKey = localStorage.getItem(storageKey);

    if (savedKey && savedKey === apiKey) setIsSaved(true);
  }, [apiKey, setIsSaved]);

  const save = useCallback(() => {
    if (!apiKey) return;

    localStorage.setItem(storageKey, apiKey);
    setIsSaved(true);
  }, [apiKey]);

  function unsave() {
    localStorage.removeItem(storageKey);
    setIsSaved(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <div style={{ whiteSpace: "nowrap" }}>API Key:</div>
      <div style={{ position: "relative", minWidth: 280 }}>
        <input
          style={{ width: "100%" }}
          type="password"
          autoComplete="off"
          placeholder="Sepana API key"
          value={apiKey ?? ""}
          onChange={(e) => {
            if (e.target.value.length === 54) setApiKey?.(e.target.value);
          }}
        />
        {apiKey && (
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 209,
              padding: 1,
              fontSize: ".835rem",
              background: COLORS.dark,
            }}
          >
            <span style={{ userSelect: "none", pointerEvents: "none" }}>
              {apiKey?.substring(50, 54)}
            </span>
            <span
              style={{ marginLeft: 20, cursor: "crosshair" }}
              role="button"
              onClick={() => {
                setApiKey?.(undefined);
                unsave();
              }}
            >
              ×
            </span>
          </div>
        )}
      </div>
      {apiKey &&
        (isSaved ? (
          <Button kind="secondary" size="small" onClick={unsave}>
            Saved
          </Button>
        ) : (
          <Button size="small" onClick={save}>
            Save
          </Button>
        ))}
    </div>
  );
}
