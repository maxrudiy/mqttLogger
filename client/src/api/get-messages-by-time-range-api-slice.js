import { apiSlice } from "./api-slice";

const messagesByTimeRangeApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMessagesByTimeRange: build.query({
      query: (timeRange) => `spm02v2/by-time-range?start-time=${timeRange.startTime}&end-time=${timeRange.endTime}`,
    }),
  }),
});

export const { useGetMessagesByTimeRangeQuery } = messagesByTimeRangeApiSlice;
