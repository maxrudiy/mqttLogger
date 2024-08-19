import express from "express";
import DashboardController from "../controllers/dashboard-controller.js";

const router = new express.Router();
router.get("/pj1203aw/messages", DashboardController.getMessages);
router.get("/pj1203aw/:history", DashboardController.getPj1203awData);

export default router;
