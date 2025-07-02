import express from "express";
import StreamController from "../controllers/stream-controller.js";

const streamRouter = new express.Router();

streamRouter.get("/stream-names", StreamController.getStreamNames);
streamRouter.get("/stream-url", StreamController.getStreamURL);
streamRouter.get("/hls/:streamId/:filename", StreamController.getStreamFiles);

export { streamRouter };
