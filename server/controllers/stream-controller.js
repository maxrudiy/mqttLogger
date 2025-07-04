import fs from "fs";
import path from "path";
import { activeStreams } from "../services/get-or-create-stream.js";
import { getOrCreateStream } from "../services/get-or-create-stream.js";
const CAMERAS = JSON.parse(process.env.CAMERAS);

class StreamController {
  getCameraNames(req, res, next) {
    try {
      res.json(Object.keys(CAMERAS));
    } catch (err) {
      next(err);
    }
  }
  async getHlsPlaylistUrl(req, res, next) {
    try {
      const selectedCamera = req.query["selected-camera"];
      const rtspUrl = CAMERAS[selectedCamera];
      if (!rtspUrl) {
        return res.status(404).send("Camera name not found.");
      }

      const hlsPlaylistUrl = await getOrCreateStream(rtspUrl);
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

export default new StreamController();
