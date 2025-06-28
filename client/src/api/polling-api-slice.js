import { apiSlice } from "./api-slice";

const pollingApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPolling: build.query({
      query: (history) => `spm02v2/${history}`,
    }),
  }),
});

export const { useGetPollingQuery } = pollingApiSlice;
