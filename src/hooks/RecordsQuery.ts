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

  const [loading, setLoading] = useState<boolean>();
  const [hits, setHits] = useState<Hits>([]);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (!engine || !apiKey) {
      setHits([]);
      setError(false);
      return;
    }

    let total: number | undefined;
    const _hits: Hits = [];

    const maxPageSize = 100;

    const query = async (page: number, initialQuery?: boolean) => {
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

      if (total === undefined) total = data.hits.total.value;

      if (total) {
        if ((page + 1) * maxPageSize > total) {
          // Sepana gives us a full pageSize of results in every query without a pointer, so we use the total to manually check that we don't adding too many hits
          _hits.push(...data.hits.hits.slice(0, total % maxPageSize));
        } else {
          _hits.push(...data.hits.hits);

          if (initialQuery) {
            // After getting total in initial query, we concurrently await all subsequent queries to speed things up
            let promises = [];

            for (let i = 1; i < total / maxPageSize; i++) {
              promises.push(query(i));
            }

            await Promise.all(promises);
          }
        }
      }

      return _hits.sort((a, b) => (a._id < b._id ? -1 : 1));
    };

    const queryAll = async () => {
      setLoading(true);

      try {
        setHits(await query(0, true));
        setError(false);
      } catch (_) {
        setHits([]);
        setError(true);
      }

      setLoading(false);
    };

    queryAll();
  }, [engine, search, apiKey, page, pageSize]);

  return { hits, error, total: hits.length, loading };
}
