import express from "express";
import StreamsController from "../controllers/streams-controller.js";

const streamsRouter = new express.Router();

streamsRouter.get("/camera-names", StreamsController.getCameraNames);
streamsRouter.get("/hls-play-list-url", StreamsController.getHlsPlaylistUrl);
streamsRouter.get("/hls/:streamId/:filename", StreamsController.getFiles);

export { streamsRouter };
