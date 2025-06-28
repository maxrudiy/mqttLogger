import express from "express";
import DashboardController from "../controllers/dashboard-controller.js";

const router = new express.Router();
router.get("/spm02v2/message", DashboardController.getSPM02V2LatestMessage);
router.get("/spm02v2/:history", DashboardController.getSPM02V2LatestHistory);

export default router;
