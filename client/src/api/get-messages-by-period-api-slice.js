import { apiSlice } from "./api-slice";

const messagesByPeriodApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getByPeriodMessages: build.query({
      query: (period) => `spm02v2/period/${period}`,
    }),
  }),
});

export const { useGetByPeriodMessagesQuery } = messagesByPeriodApiSlice;
