import { EngineContext } from "contexts/EngineContext";
import React, { useContext } from "react";

export default function SearchBar({
  searchKey,
  searchKeys,
  setSearchKey,
  searchText,
  setSearchText,
  inputId,
}: {
  searchKey: string;
  searchKeys: string[];
  setSearchKey: (key: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  inputId?: string;
}) {
  const { engine } = useContext(EngineContext);
  return (
    <div>
      <h2>Search {engine?.engine_name}</h2>
      <br />
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          >
            {searchKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          :
          <input
            id={inputId}
            style={{ width: 400 }}
            autoFocus
            value={searchText}
            type="search"
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={`Search ${searchKey}`}
          />
        </div>
      </div>
    </div>
  );
}
