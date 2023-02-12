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

  const [records, setRecords] =
    useState<Partial<RecordsQueryResponse & { error: true }>>();

  useEffect(() => {
    if (!engine || !apiKey) {
      setRecords(undefined);
      return;
    }

    sepanaAxios({ apiKey })
      .post<RecordsQueryResponse>(SEPANA_ENDPOINTS.search, {
        engine_ids: [engine.engine_id],
        query: search
          ? {
              query_string: {
                query: search.value,
                fields: [search.key],
              },
            }
          : { match_all: {} },
        size: pageSize ?? 10000,
        page: page ?? 0,
      })
      .then((res) => setRecords(res.data))
      .catch(() => setRecords({ error: true }));
  }, [engine, search, apiKey, page, pageSize]);

  return records;
}
