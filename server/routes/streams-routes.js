import express from "express";
import StreamsController from "../controllers/streams-controller.js";

const streamsRouter = new express.Router();

streamsRouter.get("/stream-names", StreamsController.getStreamsNames);
streamsRouter.get("/hls-play-list-url", StreamsController.getHlsPlaylistUrl);
streamsRouter.get("/hls/:streamId/:filename", StreamsController.getFiles);

export { streamsRouter };
