import AuthController from "../controllers/auth-controller.js";
import express from "express";
import check from "express-validator";
import { AuthMiddleware } from "../middlewares/auth-middleware.js";

const authRouter = new express.Router();

authRouter.post(
  "/user/create-or-update/",
  check.body("username").isAlphanumeric("en-US").isLength({ min: 3, max: 16 }).toLowerCase(),
  check
    .body("password")
    .isLength({ min: 3, max: 16 })
    .matches(/[a-zA-Z0-9]/),
  AuthMiddleware("admin"),
  AuthController.createOrUpdate
);
authRouter.post("/login/", AuthController.login);
authRouter.post("/logout/", AuthController.logout);
authRouter.get("/refresh/", AuthController.refresh);
authRouter.get("/users", AuthMiddleware("admin"), AuthController.getUsers);

export { authRouter };
