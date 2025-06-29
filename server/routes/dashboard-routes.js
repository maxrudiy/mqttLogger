import express from "express";
import SPM02V2Controller from "../controllers/dashboard-controller.js";

const router = new express.Router();
router.get("/spm02v2/latest/:minutes", SPM02V2Controller.getLatestMessages);

export default router;
