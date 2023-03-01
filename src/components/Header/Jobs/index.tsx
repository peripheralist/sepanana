import { JobsContext } from "contexts/JobsContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { COLORS } from "styles/colors";
import { timestampForJob } from "utils/format";

import { Job } from "./Job";

export function Jobs() {
  const { jobs, removeJob } = useContext(JobsContext);
  const [isExpanded, setIsExpanded] = useState<boolean>();

  const hasPendingJobs = useMemo(
    () => jobs?.some((job) => !job.completion_timestamp),
    [jobs]
  );

  useEffect(() => {
    // Auto expand if pending tx is added
    if (hasPendingJobs) {
      setIsExpanded(true);
    }
  }, [hasPendingJobs]);

  const hasJobs = !!jobs?.length;
  if (!hasJobs) return null;

  return (
    <>
      <div
        style={{
          display: "flex",
          cursor: "crosshair",
          whiteSpace: "nowrap",
        }}
        role="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "⌄" : ">"} {hasPendingJobs ? "Loading..." : "Jobs"}
        {jobs.length ? ` ${jobs.length}` : ""}
      </div>

      {isExpanded && (
        <div
          style={{
            position: "fixed",
            top: 60,
            right: 10,
            display: "flex",
            flexDirection: "column",
            background: COLORS.dark,
            zIndex: 10,
          }}
        >
          {jobs ? (
            jobs
              .sort((a, b) =>
                timestampForJob(a) > timestampForJob(b) ? -1 : 1
              )
              .map((job) =>
                job ? (
                  <Job
                    key={job.job_id}
                    job={job}
                    onRemove={
                      removeJob
                        ? () => {
                            removeJob(job.job_id);

                            // Close menu if removing last tx
                            if (jobs.length === 1 && isExpanded) {
                              setIsExpanded(false);
                            }
                          }
                        : undefined
                    }
                  />
                ) : null
              )
          ) : (
            <div className="font-medium">No job history</div>
          )}
        </div>
      )}
    </>
  );
}
