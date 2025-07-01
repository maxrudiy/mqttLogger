const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const RTSP_URL = process.env.RTSP_URL;
const RTMP_URL = process.env.RTMP_URL;

class VideoStreamsController {
  async getRTSP(req, res, next) {
    try {
    } catch (err) {
      return next(err);
    }
  }
  async getRTMP(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

export default new VideoStreamsController();
