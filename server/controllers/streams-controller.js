import fs from "fs";
import path from "path";
import { activeStreams } from "../services/streams-service.js";
import { getOrCreateStream } from "../services/streams-service.js";

const RTSP_URL = process.env.RTSP_URL;

class StreamsController {
  getStreamsNames(req, res, next) {
    try {
      //TODO
    } catch (err) {
      next(err);
    }
  }
  async getHlsPlaylistUrl(req, res, next) {
    try {
      const streamName = req.query["stream-name"];
      console.log(streamName);
      //TODO
      const rtspUrl = RTSP_URL;

      const hlsPlaylistUrl = await getOrCreateStream(rtspUrl);
      console.log(hlsPlaylistUrl);
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
        if (req.url.endsWith(".ts")) {
          res.setHeader("Cache-Control", "public, max-age=86400, immutable");
        } else if (req.url.endsWith(".m3u8")) {
          res.setHeader("Cache-Control", "no-cache");
        }
        res.sendFile(filePath);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new StreamsController();
