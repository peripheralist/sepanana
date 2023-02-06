import { BigNumber } from "ethers";
import { Job } from "models/job";
import moment from "moment";

export const timestampForJob = (job: Job) =>
  new Date(job.completion_timestamp ?? job.request_timestamp).valueOf();

export const historicalTime = (timestamp: string) =>
  `${moment(timestamp).fromNow(true)} ago`;
