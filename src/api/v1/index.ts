import express, { Router } from "express";
import health from "./health";
import authRouter from "./auth";
import packagerouter from "./Packages/package.routes";
import userRouter from "./Users/Users.routes";

const v1: Router = express.Router();

v1.use("/health", health);

v1.use("/auth", authRouter);

//admin protected routes
v1.use("/package", packagerouter);

v1.use("/users", userRouter);

export default v1;
