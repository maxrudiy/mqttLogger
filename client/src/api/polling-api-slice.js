import { apiSlice } from "./api-slice";

const pollingApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPolling: build.query({
      query: () => "pj1203aw",
    }),
  }),
});

export const { useGetPollingQuery } = pollingApiSlice;
