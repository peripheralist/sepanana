export type Job = {
  job_id: string;
  engine_id: string;
  status: "pending" | "processed" | "failed";
  message: string;
  request_timestamp: string;
  completion_timestamp?: string;
};
