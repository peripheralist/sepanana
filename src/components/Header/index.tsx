import React from "react";
import { COLORS } from "styles/colors";
import ApiKeyEntry from "./ApiKeyEntry";
import EngineSelector from "./EngineSelector";
import { Jobs } from "./Jobs";

export default function Header() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        gap: 40,
        padding: 20,
        alignItems: "baseline",
        background: COLORS.dark,
        zIndex: 100,
      }}
    >
      <ApiKeyEntry />
      <EngineSelector />
      <div style={{ display: "flex", flex: 1, justifyContent: "right" }}>
        <Jobs />
      </div>
    </div>
  );
}
