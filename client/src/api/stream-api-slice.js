import { apiSlice } from "./api-slice";

const streamApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStreamNames: build.query({
      query: () => "/stream-names",
    }),
    getHlsPlaylistUrl: build.query({
      query: (streamName) => `/hls-play-list-url?stream-name=${streamName}`,
    }),
  }),
});

export const { useGetStreamNamesQuery, useGetHlsPlaylistUrlQuery } = streamApiSlice;
