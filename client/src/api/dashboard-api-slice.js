import { apiSlice } from "./api-slice";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPj1203awData: build.query({
      query: (_) => "pj1203aw",
    }),
  }),
});

export const { useGetPj1203awDataQuery } = dashboardApiSlice;
