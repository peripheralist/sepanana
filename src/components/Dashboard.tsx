import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { useRecordsQuery } from "hooks/RecordsQuery";
import { SearchKey } from "models/search";
import { restrictedKeys } from "models/sepana";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { deleteAllRecords } from "utils/api";
import Button from "./Button";

import PageControls from "./PageControls";
import Record from "./Record";
import SearchBar from "./SearchBar";

const pageSize = 20;
const searchInputId = "search";

export default function Dashboard() {
  const { apiKey } = useContext(ApiKeyContext);
  const { engine } = useContext(EngineContext);
  const [searchKey, setSearchKey] = useState<SearchKey>();
  const [searchInputText, setSearchInputText] = useState<string>();
  const [searchText, setSearchText] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [searchKeys, setSearchKeys] = useState<SearchKey[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // Debounce typing. Only set new `searchText` if `searchInputText` doesn't change for `DEBOUNCE_MILLIS`
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(searchInputText);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInputText]);

  const search = useMemo(
    () =>
      searchKey && searchText
        ? {
            key: searchKey.key,
            value: searchText,
          }
        : undefined,
    [searchKey, searchText]
  );

  // When search text changes
  useEffect(() => {
    setPage(0);
  }, [searchText]);

  // When search key changes
  useEffect(() => {
    setSearchText(undefined);
    document.getElementById(searchInputId)?.focus();
  }, [searchKey]);

  const query = useRecordsQuery({ search, page, pageSize });

  const records = query?.hits?.hits;

  useEffect(() => {
    if (query?.error && searchKey) {
      setError(
        `Can't search ${searchKey.key} (${
          searchKey.type ?? "unknown type"
        }) with "${searchText}"`
      );
    } else {
      setError(undefined);
    }
  }, [query, records, searchKey, searchText]);

  useEffect(() => {
    if (!query) {
      setSearchKeys([]);
      return;
    }

    if (records?.length) {
      setSearchKeys(
        Object.entries(records?.[0]._source)
          .filter(
            ([k, v]) =>
              !restrictedKeys.includes(k) &&
              (v === null || typeof v !== "object")
          )
          .map(([k, v]) => ({
            key: k,
            type: v === null ? undefined : typeof v,
          }))
      );
    }
  }, [records, query]);

  useEffect(() => {
    if (!searchKey || !searchKeys.some((k) => k.key !== searchKey.key)) {
      setSearchKey(searchKeys.length ? searchKeys[0] : undefined);
    }
  }, [searchKeys, searchKey]);

  const total = query?.hits?.total.value;

  const deleteAll = useCallback(async () => {
    if (!apiKey || !engine) return;

    await deleteAllRecords({ apiKey, engineId: engine?.engine_id });

    setConfirmDelete(false);
  }, [apiKey, engine]);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {searchKeys.length > 0 && (
          <SearchBar
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            searchText={searchInputText ?? ""}
            setSearchText={setSearchInputText}
            searchKeys={searchKeys}
            inputId={searchInputId}
          />
        )}
        {query || !searchKeys.length ? null : confirmDelete ? (
          <div style={{ display: "flex", alignItems: "baseline" }}>
            Delete all records in this engine?{" "}
            <Button kind="danger" onClick={deleteAll}>
              Delete all
            </Button>
            <Button kind="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="small"
            kind="secondaryDanger"
            onClick={() => setConfirmDelete(true)}
          >
            Delete all
          </Button>
        )}
      </div>
      {error && (
        <div
          style={{
            display: "inline-block",
            color: "#F67429",
            background: "#F6742916",
            padding: 10,
            marginTop: 20,
          }}
        >
          {error}
        </div>
      )}
      <br />
      <br />
      {searchKeys.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h4>
            {total
              ? `${page * pageSize + 1}-${Math.min(
                  (page + 1) * pageSize,
                  total ?? 0
                )}
            of `
              : ""}
            {total ?? "--"} records
          </h4>
          {total && total > pageSize ? (
            <PageControls
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              recordsCount={total}
            />
          ) : null}
        </div>
      )}
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 30,
        }}
      >
        {records?.map((r) => (
          <Record key={r._id} record={r._source} />
        ))}
      </div>
    </div>
  );
}
