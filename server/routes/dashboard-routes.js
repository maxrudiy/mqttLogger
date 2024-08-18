import express from "express";
import DashboardController from "../controllers/dashboard-controller.js";

const router = new express.Router();
router.get("/pj1203aw", DashboardController.getPj1203awData);
router.get("/pj1203aw/messages", DashboardController.getMessages);

export default router;
