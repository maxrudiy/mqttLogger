import express from "express";
import SPM02V2Controller from "../controllers/dashboard-controller.js";
import check from "express-validator";

const router = new express.Router();
router.get("/spm02v2/latest/:minutes", check.param("minutes").isInt({ gt: 0, lt: 1440 }).toInt(10), SPM02V2Controller.getLatestMessages);
router.get(
  "/spm02v2/by-date/",
  check.query("since-time").isISO8601().toDate(),
  check.query("to-time").isISO8601().toDate(),
  SPM02V2Controller.getMessagesByDate
);
export default router;
