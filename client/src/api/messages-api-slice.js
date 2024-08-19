import { apiSlice } from "./api-slice";

const REACT_APP_WSS_URL = process.env.REACT_APP_WSS_URL;

const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query({
      query: () => "pj1203aw/messages",
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const ws = new WebSocket(REACT_APP_WSS_URL);
        try {
          await cacheDataLoaded;

          const listener = (event) => {
            const data = JSON.parse(event.data);
            const key = Object.keys(data)[0];
            updateCachedData((draft) => {
              draft[key] = data[key];
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

export const { useGetMessagesQuery } = messagesApiSlice;
