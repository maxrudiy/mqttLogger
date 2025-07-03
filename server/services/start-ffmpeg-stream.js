import { spawn } from "child_process";
import path from "path";

const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";

const startFFmpegStream = (rtspUrl, streamId, outputDir) => {
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
    "10",
    "-hls_flags",
    "delete_segments",
    "-start_number",
    "0",
    "-loglevel",
    "error",
    path.join(outputDir, "index.m3u8"),
  ];

  const ffmpegProcess = spawn(FFMPEG_PATH, ffmpegArgs);

  ffmpegProcess.stdout.on("data", (data) => {
    // console.log(`FFmpeg stdout for ${streamId}: ${data}`);
  });

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr for ${streamId}: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg process for stream ID ${streamId} exited with code ${code}`);
  });

  ffmpegProcess.on("error", (err) => {
    console.error(`Failed to start FFmpeg process for stream ID ${streamId}: ${err.message}`);
  });

  console.log(`Spawned FFmpeg with command: ffmpeg ${ffmpegArgs.join(" ")}`);
  return ffmpegProcess;
};

export { startFFmpegStream };
