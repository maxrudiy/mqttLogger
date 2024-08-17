import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { mqttClient } from "./services/mqtt-service.js";
import router from "./routes/dashboard-routes.js";
import { EventEmitter } from "node:events";
import { wsServer } from "./services/ws-service.js";

const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;
const whitelist = ["http://localhost:3000"];

const app = express();
const messageEventEmitter = new EventEmitter();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connect(DB_URL, { maxPoolSize: 10 });
      mongoose.connection.on("connected", () => {
        console.log("Connected to database");
        resolve();
      });
      mongoose.connection.on("error", (err) => reject(err));
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    mqttClient(messageEventEmitter);
    wsServer(messageEventEmitter);
  } catch (err) {
    console.log(err);
  }
};
start();
