import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { cleanupFunction } from "./functions.js";

const IDLE_TIMEOUT_MS = 120000;
const HLS_ENCODING_TIMEOUT_MS = 30000;
const CLEANUP_INTERVAL_MS = 30000;
const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";

const activeStreams = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HLS_DIR = path.join(__dirname, "../hls");
if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

const streamsService = (rtspUrl) => {
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

      const ffmpegService = () => {
        console.log(`Starting FFmpeg for stream ID: ${streamId} from ${rtspUrl}`);
        const ffmpegArgs = [
          "-rtsp_transport",
          "tcp",
          "-i",
          rtspUrl,
          "-c:v",
          "libx264",
          "-preset",
          "veryfast",
          "-tune",
          "zerolatency",
          "-crf",
          "23",
          "-vf",
          "scale=1280:-1",
          // "-c:a",
          // "aac",
          // "-ar",
          // "44100",
          // "-b:a",
          // "128k",
          "-f",
          "hls",
          "-hls_time",
          "2",
          "-hls_list_size",
          "5",
          "-hls_flags",
          "delete_segments",
          "-start_number",
          "0",
          outputPath,
        ];

        const ffmpegProcess = spawn(FFMPEG_PATH, ffmpegArgs);

        activeStreams.set(streamId, {
          process: ffmpegProcess,
          lastAccess: Date.now(),
          rtspUrl,
          outputDir,
        });

        ffmpegProcess.stdout.on("data", (data) => {
          // console.log(`FFmpeg stdout for ${streamId}: ${data}`);
        });

        ffmpegProcess.stderr.on("data", (data) => {
          console.error(`FFmpeg stderr for ${streamId}: ${data}`);
        });

        ffmpegProcess.on("close", (code) => {
          console.log(`FFmpeg process for stream ID ${streamId} exited with code ${code}`);
          activeStreams.delete(streamId);
          cleanupFunction(outputDir);
        });

        ffmpegProcess.on("error", (err) => {
          console.error(`Failed to start FFmpeg process for stream ID ${streamId}: ${err.message}`);
          activeStreams.delete(streamId);
          cleanupFunction(outputDir);
          reject(err);
        });

        console.log(`Spawned FFmpeg with command: ffmpeg ${ffmpegArgs.join(" ")}`);
      };

      if (!existingStreamId) {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }
        ffmpegService();
        await waitForHLSFiles(outputPath, outputDir);
        resolve(`/hls/${streamId}/index.m3u8`);
      } else {
        activeStreams.get(streamId).lastAccess = Date.now();
        console.log(`Stream ${streamId} already active, updated last access time.`);
        resolve(`/hls/${streamId}/index.m3u8`);
      }
    } catch (err) {
      activeStreams.delete(streamId);
      cleanupFunction(outputDir);
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

export { streamsService, activeStreams };
