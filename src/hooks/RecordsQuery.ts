import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { SearchOpts } from "models/search";
import { RecordsQueryResponse } from "models/sepana";
import { useContext, useEffect, useState } from "react";
import { SEPANA_ENDPOINTS, sepanaAxios } from "utils/http";

type Hits = RecordsQueryResponse["hits"]["hits"];

export function useRecordsQuery({
  search,
  page,
  pageSize,
}: {
  search?: SearchOpts;
  page?: number;
  pageSize?: number;
}) {
  const { engine } = useContext(EngineContext);
  const { apiKey } = useContext(ApiKeyContext);

  const [hits, setHits] = useState<Hits>([]);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (!engine || !apiKey) {
      setHits([]);
      setError(false);
      return;
    }

    const query = async (page: number) => {
      const maxPageSize = 100;

      const _hits: Hits = [];

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
        size: maxPageSize,
        page,
      });

      _hits.push(...data.hits.hits);

      if (data.hits.total.value === maxPageSize) await query(page + 1);

      return _hits;
    };

    const queryAll = async () => {
      try {
        setHits(await query(0));
        setError(false);
      } catch (_) {
        setHits([]);
        setError(true);
      }
    };

    queryAll();
  }, [engine, search, apiKey, page, pageSize]);

  return { hits, error, total: hits.length };
}
