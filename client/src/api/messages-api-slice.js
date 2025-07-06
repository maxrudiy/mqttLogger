import { apiSlice } from "./api-slice";

const REACT_APP_WSS_URL = process.env.REACT_APP_WSS_URL;
const REACT_APP_WSS_RECONNECT_DELAY = parseInt(process.env.REACT_APP_WSS_RECONNECT_DELAY, 10);

const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLatestMessages: build.query({
      query: ({ minutes, hex }) => `spm02v2/latest?minutes=${minutes}&selected-device=${hex}`,
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded;

        let ws;
        let shouldReconnect = true;
        const connect = () => {
          ws = new WebSocket(REACT_APP_WSS_URL);

          ws.addEventListener("open", () => {
            console.log("WebSocket connected");
          });

          ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            updateCachedData((draft) => {
              console.log(data); //TODO Update only if hex of data == hex of selected device
              draft.unshift(data);
              draft.pop();
            });
          });

          ws.addEventListener("close", () => {
            console.log("WebSocket closed");
            if (shouldReconnect) {
              setTimeout(connect, REACT_APP_WSS_RECONNECT_DELAY);
            }
          });

          ws.addEventListener("error", (err) => {
            console.error("WebSocket error", err);
            ws.close();
          });
        };

        connect();

        await cacheEntryRemoved;

        shouldReconnect = false;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      },
    }),
    getMessagesByTimeRange: build.query({
      query: ({ startTime, endTime, hex }) => `spm02v2/by-time-range?start-time=${startTime}&end-time=${endTime}&selected-device=${hex}`,
    }),
  }),
});

export const { useGetLatestMessagesQuery, useGetMessagesByTimeRangeQuery } = messagesApiSlice;
