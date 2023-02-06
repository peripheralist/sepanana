import Button from "components/Button";
import { Job } from "models/job";
import { historicalTime } from "utils/format";

export function Job({ job, onRemove }: { job: Job; onRemove?: VoidFunction }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          border: "1px solid white",
          padding: 15,
        }}
      >
        <div style={{ display: "flex" }}>
          <span style={{ fontWeight: 600 }}>
            {job.job_id.split("").slice(0, 4).join("")}...
            {job.job_id.split("").slice(-4).join("")}{" "}
            <span style={{ fontVariant: "small-caps" }}>{job.status}</span>
          </span>{" "}
          - {historicalTime(job.completion_timestamp ?? job.request_timestamp)}
        </div>

        {onRemove && (
          <Button size="small" onClick={() => onRemove?.()}>
            ×
          </Button>
        )}
      </div>
      {job.message && job.status !== "processed" ? job.message : ""}
    </div>
  );
}
