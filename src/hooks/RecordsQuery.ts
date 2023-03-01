import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { SearchOpts } from "models/search";
import { RecordsQueryResponse } from "models/sepana";
import { useContext, useEffect, useState } from "react";
import { SEPANA_ENDPOINTS, sepanaAxios } from "utils/http";

type Hits = RecordsQueryResponse["hits"]["hits"];

const maxPageSize = 100;

export function useRecordsQuery({
  search,
  page,
  pageSize,
  exhaustive,
}: {
  search?: SearchOpts;
  page?: number;
  pageSize?: number;
  exhaustive?: boolean;
}) {
  const { engine } = useContext(EngineContext);
  const { apiKey } = useContext(ApiKeyContext);

  const [loading, setLoading] = useState<boolean>();
  const [total, setTotal] = useState<number>();
  const [hits, setHits] = useState<Hits>([]);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    setHits([]);
    setTotal(0),
    setError(false);

    if (!engine || !apiKey) return;

    const _hits: Hits = []
    let _total: number | undefined = undefined

    const query = async (_page: number = 1) => {
      const { data } = await sepanaAxios({
        apiKey,
      }).post<RecordsQueryResponse>(SEPANA_ENDPOINTS.search, {
        engine_ids: [engine.engine_id],
        query: search
          ? {
              query_string: {
                query: search.value,
                fields: [search.key],
              },
            }
          : { match_all: {} },
        page: _page,
        ...(exhaustive
          ? { sort: ["_id"], size: maxPageSize }
          : { size: pageSize }),
      });

      _hits.push(...data.hits.hits);
      if (_total === undefined) _total = data.hits.total.value;
    };

    const queryAll = async () => {
      setLoading(true);

      try {
        await query(page);

        if (exhaustive && _total && _hits.length === maxPageSize) {
          // After getting total in initial query, we concurrently await all subsequent queries to speed things up
          const promises = [];

          for (let i = 2; i - 1 < _total / maxPageSize; i++) {
            promises.push(query(i));
          }

          await Promise.all(promises);
        }

        setHits(_hits)
        setTotal(_total)
        setError(false);
      } catch (_) {
        setHits([]);
        setTotal(0);
        setError(true);
      }

      setLoading(false);
    };

    queryAll();
  }, [engine, search, apiKey, page, pageSize, exhaustive]);

  return { hits, error, total, loading };
}
