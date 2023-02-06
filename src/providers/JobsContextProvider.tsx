import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { JobsContext } from "contexts/JobsContext";
import { Job } from "models/job";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearInterval, setInterval } from "timers";
import { getJobs } from "utils/api";
import { timestampForJob } from "utils/format";

const nowSeconds = () => Math.round(new Date().valueOf() / 1000);

const SHORT_POLL_INTERVAL_MILLISECONDS = 3 * 1000; // 3 sec
const LONG_POLL_INTERVAL_MILLISECONDS = 12 * 1000; // 12 sec

// Arbitrary time to give folks a sense of tx history
const JOB_HISTORY_TIME_SECS = 60 * 60; // 1 hr

export default function JobsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { apiKey } = useContext(ApiKeyContext);
  const { engine } = useContext(EngineContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  const localStorageKey = useMemo(
    () =>
      apiKey && engine?.engine_id
        ? `jobs_${apiKey.substring(0, 8)}_${engine.engine_id.substring(0, 8)}`
        : undefined,
    [apiKey, engine]
  );

  // Sets TransactionLogs in both localStorage and state
  // Ensures localStorage is always up to date, so we can persist good data on refresh
  const _setJobs = useCallback(
    (jobs: Job[]) => {
      if (!localStorageKey) return;

      localStorage.setItem(localStorageKey, JSON.stringify(jobs));
      setJobs(jobs);
    },
    [localStorageKey]
  );

  // Load initial state
  useEffect(() => {
    if (!localStorageKey) return;

    _setJobs(
      JSON.parse(localStorage.getItem(localStorageKey) || "[]")
        // Only persist jobs that are failed/pending
        // or were created within history window
        .filter(
          (job: Job) =>
            job.status !== "processed" ||
            nowSeconds() - JOB_HISTORY_TIME_SECS < timestampForJob(job)
        ) as Job[]
    );
  }, [_setJobs, localStorageKey]);

  // Setup poller for refreshing transactions
  useEffect(() => {
    if (!apiKey) return;

    // Only set new poller if there are pending jobs
    // Completed jobs don't need to be refreshed
    if (!jobs.length || !jobs.some((job) => !job.completion_timestamp)) {
      return;
    }

    // If any pending txs were created less than 3 min ago, use short poll time
    // Otherwise use longer poll time
    // (Assume no need for quick UX if user has already waited 3 min)
    const threeMinutesAgo = nowSeconds() - 3 * 60;
    const pollInterval = jobs.some(
      (job) =>
        !job.completion_timestamp && threeMinutesAgo < timestampForJob(job)
    )
      ? SHORT_POLL_INTERVAL_MILLISECONDS
      : LONG_POLL_INTERVAL_MILLISECONDS;

    console.info("JobsContextProvider::Setting poller", pollInterval);

    const poller = setInterval(async () => {
      console.info("JobsContextProvider::poller::polling for tx updates...");

      const polledJobs = await getJobs({
        apiKey,
        jobIds: jobs.map((j) => j.job_id),
      });

      console.info(
        "JobsContextProvider::poller::updating jobs state",
        polledJobs
      );
      _setJobs(polledJobs);
    }, pollInterval);

    // Clean up
    return () => {
      console.info("JobsContextProvider::poller::removing poller");

      clearInterval(poller);
    };
  }, [jobs, _setJobs, apiKey]);

  const addJobs = useCallback(
    (jobIds: string[]) => {
      if (!apiKey) return;

      getJobs({ apiKey, jobIds }).then((_jobs) =>
        _setJobs([...jobs, ..._jobs])
      );
    },
    [jobs, _setJobs, apiKey]
  );

  const removeJob = useCallback(
    (jobId: string) => _setJobs(jobs.filter((job) => job.job_id !== jobId)),
    [jobs, _setJobs]
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        addJobs,
        removeJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
