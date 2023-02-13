import { EngineContext } from "contexts/EngineContext";
import { SearchKey } from "models/search";
import React, { useContext } from "react";

export default function SearchBar({
  searchKey,
  searchKeys,
  setSearchKey,
  searchText,
  setSearchText,
  inputId,
}: {
  searchKey: SearchKey | undefined;
  searchKeys: SearchKey[] | undefined;
  setSearchKey: (key: SearchKey) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  inputId?: string;
}) {
  const { engine } = useContext(EngineContext);

  return (
    <div>
      <h2>
        {searchKeys?.length ? "Search " : null}
        {engine?.engine_name}
      </h2>
      <br />
      {searchKeys?.length && searchKey ? (
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <select
              value={JSON.stringify(searchKey)}
              onChange={(e) => setSearchKey(JSON.parse(e.target.value))}
            >
              {searchKeys.map((k) => (
                <option key={k.key} value={JSON.stringify(k)}>
                  {k.key} ({k.type ?? "unknown type"})
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
              placeholder={`Search ${searchKey.key}`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
