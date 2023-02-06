import { Job } from "models/job";
import { SepanaRecord } from "models/sepana";

import { SEPANA_ENDPOINTS, sepanaAxios } from "./http";

/**
 * Writes records to Sepana engine in groups of 500.
 *
 * @param records Projects to write to Sepana database
 */
export async function writeSepanaRecords<T extends SepanaRecord>({
  apiKey,
  engineId,
  records,
}: {
  apiKey: string;
  engineId: string;
  records: T[];
}) {
  const jobs: string[] = [];
  const errors: (string | object)[] = [];
  const written: T[] = [];

  // Clone array because we mutate it
  const pageSize = 500;
  let page = 0;

  while (records.length > pageSize * page) {
    const queue = records
      .slice(pageSize * page, pageSize * (page + 1))
      .map((r) => ({ ...r, _id: r.id }));

    await sepanaAxios({ apiKey })
      .post<{ job_id: string }>(SEPANA_ENDPOINTS.insert, {
        engine_id: engineId,
        docs: queue,
      })
      .then((res) => {
        jobs.push(res.data.job_id);
        written.push(...queue);
      })
      .catch((err) => {
        errors.push(err);
      });

    page++;
  }

  return { jobs, written, errors };
}

export async function deleteRecord({
  apiKey,
  engineId,
  recordId,
}: {
  apiKey: string;
  engineId: string;
  recordId: string;
}) {
  return sepanaAxios({ apiKey }).delete(SEPANA_ENDPOINTS.delete, {
    data: {
      engine_id: engineId,
      delete_query: {
        query: {
          match_phrase: {
            id: recordId,
          },
        },
      },
    },
  });
}

export async function getJobs({
  apiKey,
  jobIds,
}: {
  apiKey: string;
  jobIds: string[];
}) {
  return Promise.all(
    jobIds.map((jobId) => getJob({ apiKey, jobId }).then((r) => r.data))
  );
}

export async function getJob({
  apiKey,
  jobId,
}: {
  apiKey: string;
  jobId: string;
}) {
  return sepanaAxios({ apiKey }).get<Job>(SEPANA_ENDPOINTS.job(jobId));
}
