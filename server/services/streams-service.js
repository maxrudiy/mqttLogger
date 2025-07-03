import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanupFunction } from "./functions.js";
import { startFFmpegStream } from "./start-ffmpeg-stream.js";

const IDLE_TIMEOUT_MS = 120000;
const HLS_ENCODING_TIMEOUT_MS = 10000;
const CLEANUP_INTERVAL_MS = 30000;

const activeStreams = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HLS_DIR = path.join(__dirname, "../hls");
if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

const getOrCreateStream = (rtspUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
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
        startFFmpegStream(rtspUrl, streamId, activeStreams, outputDir, outputPath);
        await waitForHLSFiles(outputPath, outputDir);
        resolve(`/hls/${streamId}/index.m3u8`);
      } else {
        activeStreams.get(streamId).lastAccess = Date.now();
        console.log(`Stream ${streamId} already active, updated last access time.`);
        resolve(`/hls/${streamId}/index.m3u8`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

setInterval(() => {
  const now = Date.now();
  for (const [streamId, streamInfo] of activeStreams.entries()) {
    if (now - streamInfo.lastAccess > IDLE_TIMEOUT_MS) {
      console.log(`Stream ID ${streamId} has been idle for too long. Killing FFmpeg process.`);
      streamInfo.process.kill("SIGINT");
    }
  }
}, CLEANUP_INTERVAL_MS);

const waitForHLSFiles = (playlistPath, dir) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for HLS files")), HLS_ENCODING_TIMEOUT_MS);
    const watcher = fs.watch(dir, (event, filename) => {
      if (filename === path.basename(playlistPath)) {
        const playlistExists = fs.existsSync(playlistPath);
        const tsExists = fs.readdirSync(dir).some((file) => file.endsWith(".ts"));
        if (playlistExists && tsExists) {
          clearTimeout(timer);
          watcher.close();
          resolve();
        }
      }
    });
  });
};

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  activeStreams.forEach((streamInfo, streamId) => {
    console.log(`Killing FFmpeg process for stream ID: ${streamId}`);
    streamInfo.process.kill("SIGINT");
  });
  console.log("Exiting Node.js process.");
  process.exit();
});

export { getOrCreateStream, activeStreams };
