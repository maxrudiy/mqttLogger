import { apiSlice } from "./api-slice";

const streamsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCameraNames: build.query({
      query: () => "/camera-names",
    }),
    getHlsPlaylistUrl: build.query({
      query: (selectedCamera) => `/hls-play-list-url?selected-camera=${selectedCamera}`,
    }),
  }),
});

export const { useGetCameraNamesQuery, useGetHlsPlaylistUrlQuery } = streamsApiSlice;
