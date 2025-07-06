import express from "express";
import SPM02V2Controller from "../controllers/spm02v2-controller.js";
import check from "express-validator";

const SPM02V2Router = new express.Router();
SPM02V2Router.get(
  "/spm02v2/latest/",
  check.query("minutes").isInt({ gt: 0, lt: 1440 }).toInt(10),
  check.query("selected-device").isHexadecimal(),
  SPM02V2Controller.getLatestMessages
);
SPM02V2Router.get(
  "/spm02v2/by-time-range/",
  check.query("start-time").isISO8601().toDate(),
  check.query("end-time").isISO8601().toDate(),
  check.query("selected-device").isHexadecimal(),
  SPM02V2Controller.getMessagesByTimeRange
);
export { SPM02V2Router };
