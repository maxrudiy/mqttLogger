import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

import { UserModel } from "./models/user-model.js";
import { mqttClient } from "./services/mqtt-service.js";
import { authRouter } from "./routes/auth-routes.js";
import { SPM02V2Router } from "./routes/spm02v2-routes.js";
import { streamRouter } from "./routes/stream-routes.js";
import { BSD17Router } from "./routes/bsd17-routes.js";
import { wsServer } from "./services/wss-service.js";
import { errorLogger, errorResponse } from "./middlewares/errors-middleware.js";

const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;
const CORS_WHITE_LIST = process.env.CORS_WHITE_LIST ? process.env.CORS_WHITE_LIST.split(",") : [];
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const app = express();

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
app.use(cookieParser());
app.use(authRouter);
app.use(SPM02V2Router);
app.use(BSD17Router);
app.use(streamRouter);
app.use(errorLogger);
app.use(errorResponse);

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connect(DB_URL, { maxPoolSize: 10 });
      mongoose.connection.on("connected", async () => {
        console.log("Connected to database");
        const adminExists = await UserModel.exists({ username: ADMIN_USERNAME });
        if (!adminExists) {
          const passHash = await bcrypt.hash(ADMIN_PASSWORD, 3);
          UserModel.create({ username: ADMIN_USERNAME, password: passHash, groups: ["admin", "user"] });
        }
        resolve();
      });
      mongoose.connection.on("error", (err) => reject(err));
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    mqttClient();
    wsServer();
  } catch (err) {
    console.log(err);
  }
};
start();
