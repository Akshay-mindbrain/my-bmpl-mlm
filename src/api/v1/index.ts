import express, { Router } from "express";
import health from "./health";
import authRouter from "./auth";
import userRouter from "./user";
import packagerouter from "./Packages/package.routes";

const v1: Router = express.Router();

v1.use("/health", health);

v1.use("/auth", authRouter);

//admin protected routes
v1.use("/package", packagerouter);
v1.use("/users", userRouter);

export default v1;
