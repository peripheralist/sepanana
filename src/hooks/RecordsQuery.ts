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
  const [total, setTotal] = useState<number>();
  const [hits, setHits] = useState<Hits>([]);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (!engine || !apiKey) {
      setHits([]);
      setError(false);
      return;
    }

    const query = async () => {
      const { data } = await sepanaAxios({
        apiKey,
      }).post<RecordsQueryResponse>(SEPANA_ENDPOINTS.search, {
        engine_ids: [engine.engine_id],
        sort: ['_id'],
        query: search
          ? {
              query_string: {
                query: search.value,
                fields: [search.key],
              },
            }
          : { match_all: {} },
        size: pageSize,
        page,
      });

      setTotal(data.hits.total.value);
      setHits(data.hits.hits);
    };

    const queryAll = async () => {
      setLoading(true);

      try {
        await query();
        setError(false);
      } catch (_) {
        setHits([]);
        setError(true);
      }

      setLoading(false);
    };

    queryAll();
  }, [engine, search, apiKey, page, pageSize]);

  return { hits, error, total, loading };
}
