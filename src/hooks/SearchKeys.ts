import { SearchKey } from "models/search";
import { restrictedKeys } from "models/sepana";
import { useMemo } from "react";

import { useRecordsQuery } from "./RecordsQuery";

export function useSearchKeys() {
  const { records, total } = useRecordsQuery({});

  return useMemo(() => {
    if (!total) return [];

    let _searchKeys: Record<string, SearchKey> = {};

    records.forEach((r) =>
      Object.entries(r._source).forEach(([key, value]) => {
        if (
          !restrictedKeys.has(key) &&
          (!_searchKeys[key] || _searchKeys[key].type === undefined)
        ) {
          _searchKeys[key] = {
            key,
            type: value === null ? undefined : typeof value,
          };
        }
      })
    );

    return Object.values(_searchKeys);
  }, [records, total]);
}
