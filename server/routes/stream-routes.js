import express from "express";
import StreamController from "../controllers/stream-controller.js";

const streamRouter = new express.Router();

streamRouter.get("/stream-names", StreamController.getStreamNames);
streamRouter.get("/hls-play-list-url", StreamController.getHlsPlaylistUrl);
streamRouter.get("/hls/:streamId/:filename", StreamController.getFiles);

export { streamRouter };
