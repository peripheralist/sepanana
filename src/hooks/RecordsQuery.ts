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

    let total = 0;
    const _hits: Hits = [];

    const maxPageSize = 100;

    const query = async (page: number) => {
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

      if (!total) total = data.hits.total.value;

      if (total) {
        if ((page + 1) * maxPageSize > total) {
          _hits.push(...data.hits.hits.slice(0, total % maxPageSize));
        } else {
          _hits.push(...data.hits.hits);

          await query(page + 1);
        }
      }

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
