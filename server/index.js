import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { mqttClient } from "./services/mqtt-service.js";
import { SPM02V2Router } from "./routes/spm02v2-routes.js";
import { EventEmitter } from "node:events";
import { wsServer } from "./services/wss-service.js";
import { errorLogger, errorResponse } from "./middlewares/errors-middleware.js";

const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;
const CORS_WHITE_LIST = process.env.CORS_WHITE_LIST ? process.env.CORS_WHITE_LIST.split(",") : [];

const app = express();
const messageEventEmitter = new EventEmitter();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || CORS_WHITE_LIST.indexOf(origin) !== -1) {
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
app.use(SPM02V2Router);
app.use(errorLogger);
app.use(errorResponse);

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
