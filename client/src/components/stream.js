import React, { useEffect, useRef } from "react";
import { useGetHlsPlaylistUrlQuery } from "../api/stream-api-slice";
import Hls from "hls.js";

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Stream = () => {
  const videoRef = useRef(null);
  let hlsInstance = useRef(null);

  const { data, isLoading, error } = useGetHlsPlaylistUrlQuery("name");

  useEffect(() => {
    if (isLoading) {
      console.log("Stream data is loading...");
      return;
    }

    if (error) {
      console.error("Error fetching HLS URL:", error);
      return;
    }

    if (data && data.hlsUrl && videoRef.current) {
      const videoElement = videoRef.current;
      const fullHlsUrl = REACT_APP_SERVER_URL + data.hlsUrl;

      if (Hls.isSupported()) {
        if (!hlsInstance.current) {
          hlsInstance.current = new Hls({ debug: true });
          hlsInstance.current.log = true;
        }

        hlsInstance.current.loadSource(fullHlsUrl);
        hlsInstance.current.attachMedia(videoElement);

        hlsInstance.current.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch((playError) => {
            console.error("Error attempting to play video:", playError);
          });
        });

        hlsInstance.current.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS.js error event:", event, "data:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Fatal network error, trying to recover...");
                hlsInstance.current.recoverMediaError();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Fatal media error, trying to recover...");
                hlsInstance.current.recoverMediaError();
                break;
              default:
                console.error("Unrecoverable HLS error, destroying instance.");
                hlsInstance.current.destroy();
                hlsInstance.current = null;
                break;
            }
          }
        });
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("Using native HLS support.");
        videoElement.src = fullHlsUrl;
        videoElement.addEventListener("loadedmetadata", () => {
          videoElement.play().catch((playError) => {
            console.error("Error attempting to play video (native):", playError);
          });
        });
      } else {
        console.error("HLS is not supported in this browser.");
      }
    }

    return () => {
      if (hlsInstance.current) {
        console.log("Destroying Hls.js instance...");
        hlsInstance.current.destroy();
        hlsInstance.current = null;
      }
    };
  }, [data, isLoading, error]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading video stream...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load video stream: {error.message}</div>;
  }

  return <video ref={videoRef} controls autoPlay muted className="w-full h-auto rounded-lg shadow-md" />;
};

export { Stream };
