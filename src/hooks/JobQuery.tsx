import { ApiKeyContext } from "contexts/ApiKeyContext";
import { Job } from "models/job";
import { useContext, useEffect, useState } from "react";
import { SEPANA_ENDPOINTS, sepanaAxios } from "utils/http";

export function useJobQuery(jobId: string) {
  const { apiKey } = useContext(ApiKeyContext);
  const [job, setJob] = useState<Job>();

  useEffect(() => {
    if (!apiKey) return;

    sepanaAxios({ apiKey })
      .get<Job>(SEPANA_ENDPOINTS.job(jobId))
      .then((res) => setJob(res.data));
  }, [apiKey, jobId]);

  return job;
}
