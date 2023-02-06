import { Job } from "models/job";
import { createContext } from "react";

export const JobsContext: React.Context<{
  jobs?: Job[];
  addJobs?: (jobIds: string[]) => void;
  removeJob?: (jobId: string) => void;
}> = createContext({});
