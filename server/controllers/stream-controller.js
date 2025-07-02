import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

import { ffmpegService } from "../services/ffmpeg-service.js";

const RTSP_URL = process.env.RTSP_URL;
const IDLE_TIMEOUT_MS = 300000;
const CLEANUP_INTERVAL_MS = 30000;

const activeStreams = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HLS_DIR = path.join(__dirname, "../hls");
if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

class StreamController {
  getStreamNames(req, res, next) {
    try {
      //TODO
    } catch (err) {
      next(err);
    }
  }
  getHlsPlaylistUrl(req, res, next) {
    try {
      const streamName = req.query["stream-name"];
      console.log(streamName);
      //TODO
      const rtspUrl = RTSP_URL;

      let existingStreamId = null;
      for (const [id, streamInfo] of activeStreams.entries()) {
        if (streamInfo.rtspUrl === rtspUrl) {
          existingStreamId = id;
          break;
        }
      }

      const streamId = existingStreamId || Date.now().toString();
      const outputDir = path.join(HLS_DIR, streamId);
      const outputPath = path.join(outputDir, "index.m3u8");

      if (!existingStreamId) {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }
        ffmpegService(rtspUrl, streamId, outputDir, outputPath, activeStreams);
      } else {
        activeStreams.get(streamId).lastAccess = Date.now();
        console.log(`Stream ${streamId} already active, updated last access time.`);
      }

      const hlsPlaylistUrl = `/hls/${streamId}/index.m3u8`;
      res.json({ hlsUrl: hlsPlaylistUrl });
    } catch (err) {
      return next(err);
    }
  }
  getFiles(req, res, next) {
    try {
      const { streamId, filename } = req.params;
      const streamInfo = activeStreams.get(streamId);

      if (!streamInfo) {
        return res.status(404).send("Stream not found or expired.");
      }
      streamInfo.lastAccess = Date.now();

      const filePath = path.join(streamInfo.outputDir, filename);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          if (err.code === "ENOENT") {
            return res.status(404).send("File not found.");
          }
          console.error(`Error serving HLS file ${filePath}:`, err);
          return res.status(500).send("Server error.");
        }

        res.sendFile(filePath);
      });
    } catch (err) {
      next(err);
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [streamId, streamInfo] of activeStreams.entries()) {
    if (now - streamInfo.lastAccess > IDLE_TIMEOUT_MS) {
      console.log(`Stream ID ${streamId} has been idle for too long. Killing FFmpeg process.`);
      streamInfo.process.kill("SIGINT");
    }
  }
}, CLEANUP_INTERVAL_MS);

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  activeStreams.forEach((streamInfo, streamId) => {
    console.log(`Killing FFmpeg process for stream ID: ${streamId}`);
    streamInfo.process.kill("SIGINT");
  });
  console.log("Exiting Node.js process.");
  process.exit();
});

export default new StreamController();
