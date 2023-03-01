import { SearchKey } from "models/search";
import { restrictedKeys } from "models/sepana";
import { useMemo } from "react";

import { useRecordsQuery } from "./RecordsQuery";

export function useSearchKeys() {
  const { hits, total } = useRecordsQuery({exhaustive: true});

  return useMemo(() => {
    if (!total) return [];

    let _searchKeys: Record<string, SearchKey> = {};

    hits.forEach((h) =>
      Object.entries(h._source)
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .forEach(([key, value]) => {
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
  }, [hits, total]);
}
