import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_SERVER_URL,
  }),
  endpoints: (build) => ({}),
});

export { apiSlice };
