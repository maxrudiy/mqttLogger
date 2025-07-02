import { spawn } from "child_process";
import fs from "fs";

// Path to ffmpeg.exe should be in system's PATH environment variable
const ffmpegService = (rtspUrl, streamId, outputDir, outputPath, activeStreams) => {
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

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

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
    fs.rm(outputDir, { recursive: true, force: true }, (err) => {
      if (err) console.error(`Error cleaning up HLS directory ${outputDir}:`, err);
      else console.log(`Cleaned up HLS directory: ${outputDir}`);
    });
  });

  ffmpegProcess.on("error", (err) => {
    console.error(`Failed to start FFmpeg process for stream ID ${streamId}: ${err.message}`);
    activeStreams.delete(streamId);
    fs.rm(outputDir, { recursive: true, force: true }, (cleanupErr) => {
      if (cleanupErr) console.error(`Error cleaning up HLS directory on error ${outputDir}:`, cleanupErr);
    });
  });

  console.log(`Spawned FFmpeg with command: ffmpeg ${ffmpegArgs.join(" ")}`);
};

export { ffmpegService };
