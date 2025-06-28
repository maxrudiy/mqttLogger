import { apiSlice } from "./api-slice";

const REACT_APP_WSS_URL = process.env.REACT_APP_WSS_URL;

const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMessage: build.query({
      query: () => "spm02v2/message",
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const ws = new WebSocket(REACT_APP_WSS_URL);
        try {
          await cacheDataLoaded;

          const listener = (event) => {
            const data = JSON.parse(event.data);
            const propertyName = data.propertyName;
            updateCachedData((draft) => {
              draft[propertyName] = data.value;
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

export const { useGetMessageQuery } = messageApiSlice;
