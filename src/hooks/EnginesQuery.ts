import { EnginesQueryResponse } from "models/sepana";
import { useEffect, useState } from "react";
import { SEPANA_ENDPOINTS, sepanaAxios } from "utils/http";

export function useEnginesQuery(apiKey: string | undefined) {
  const [engines, setEngines] = useState<EnginesQueryResponse[]>();

  useEffect(() => {
    if (!apiKey) {
      setEngines(undefined);
      return;
    }

    sepanaAxios({ apiKey })
      .get<EnginesQueryResponse[]>(SEPANA_ENDPOINTS.engines)
      .then((res) => setEngines(res.data));
  }, [apiKey]);

  return engines;
}
