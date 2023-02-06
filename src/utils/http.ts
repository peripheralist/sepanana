import axios from "axios";

export const sepanaAxios = ({ apiKey }: { apiKey: string }) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEPANA_API_URL,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  });

export const SEPANA_ENDPOINTS = {
  search: "/search",
  insert: "/engine/insert_data",
  delete: "engine/data/delete",
  engines: "engine/user/list",
  job: (jobId: string) => `/job/status/${jobId}`,
};
