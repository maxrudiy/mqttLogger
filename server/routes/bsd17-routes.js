import express from "express";
import { mqttEventEmitter } from "../events/events.js";

const BSD17Router = new express.Router();

BSD17Router.get("/bsd17/toggle", (req, res, next) => {
  mqttEventEmitter.emit("command", { device: "0xA68E", send: { Power: "toggle" } });
  res.status(200).json({ message: "Request successful" });
});

export { BSD17Router };
