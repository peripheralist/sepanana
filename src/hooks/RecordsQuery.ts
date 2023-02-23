import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { SearchOpts } from "models/search";
import { RecordsQueryResponse } from "models/sepana";
import { useContext, useEffect, useState } from "react";
import { SEPANA_ENDPOINTS, sepanaAxios } from "utils/http";

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

  const [records, setRecords] = useState<RecordsQueryResponse["hits"]["hits"]>(
    []
  );
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (!engine || !apiKey) {
      setRecords([]);
      return;
    }

    const query = async (page: number) => {
      const maxPageSize = 100;

      const _records: RecordsQueryResponse["hits"]["hits"] = [];

      const { data } = await sepanaAxios({
        apiKey,
      }).post<RecordsQueryResponse>(SEPANA_ENDPOINTS.search, {
        engine_ids: [process.env.SEPANA_ENGINE_ID],
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

      _records.push(...data.hits.hits);

      if (data.hits.total.value === maxPageSize) await query(page + 1);

      return _records;
    };

    const queryAll = async () => {
      try {
        setRecords(await query(0));
      } catch (_) {
        setRecords([]);
        setError(true);
      }
    };

    queryAll();
  }, [engine, search, apiKey, page, pageSize]);

  return { records, error, total: records?.length };
}
