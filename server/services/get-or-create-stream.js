import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanupDir, waitForHLSFiles } from "./functions.js";
import { startFFmpegStream } from "./start-ffmpeg-stream.js";

const IDLE_TIMEOUT_MS = 120000;
const HLS_ENCODING_TIMEOUT_MS = 60000;
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
      if (existingStreamId) {
        activeStreams.get(streamId).lastAccess = Date.now();
        console.log(`Stream ${streamId} already active, updated last access time.`);
        return resolve(`/hls/${streamId}/index.m3u8`);
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      const ffmpegProcess = startFFmpegStream(rtspUrl, streamId, outputDir);
      activeStreams.set(streamId, {
        process: ffmpegProcess,
        lastAccess: Date.now(),
        rtspUrl,
        outputDir,
      });
      await waitForHLSFiles(outputDir, HLS_ENCODING_TIMEOUT_MS);
      return resolve(`/hls/${streamId}/index.m3u8`);
    } catch (err) {
      return reject(err);
    }
  });
};

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [streamId, streamInfo] of activeStreams.entries()) {
    if (now - streamInfo.lastAccess > IDLE_TIMEOUT_MS) {
      console.log(`Cleaning up idle stream: ${streamId}`);
      cleanupStream(streamId, streamInfo.outputDir);
    }
  }
}, CLEANUP_INTERVAL_MS);

function cleanupStream(streamId, outputDir) {
  const streamInfo = activeStreams.get(streamId);
  streamInfo.process.kill("SIGINT");
  activeStreams.delete(streamId);
  cleanupDir(outputDir);
}

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  clearInterval(cleanupInterval);
  activeStreams.forEach((streamInfo, streamId) => {
    console.log(`Killing FFmpeg process for stream ID: ${streamId}`);
    streamInfo.process.kill("SIGINT");
  });
  activeStreams.clear();
  console.log("Exiting Node.js process.");
  process.exit();
});

export { getOrCreateStream, activeStreams };
