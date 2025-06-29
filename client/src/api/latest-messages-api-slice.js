import { apiSlice } from "./api-slice";

const REACT_APP_WSS_URL = process.env.REACT_APP_WSS_URL;

const latestMessagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLatestMessages: build.query({
      query: (minutes) => `spm02v2/latest/${minutes}`,
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const ws = new WebSocket(REACT_APP_WSS_URL);
        try {
          await cacheDataLoaded;

          const listener = (event) => {
            const data = JSON.parse(event.data);
            updateCachedData((draft) => {
              draft.unshift(data);
              draft.pop();
            });
          };

          ws.addEventListener("message", listener);
        } catch {}
        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetLatestMessagesQuery } = latestMessagesApiSlice;
