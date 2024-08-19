import { apiSlice } from "./api-slice";

const pollingApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPolling: build.query({
      query: (history) => `pj1203aw/${history}`,
    }),
  }),
});

export const { useGetPollingQuery } = pollingApiSlice;
