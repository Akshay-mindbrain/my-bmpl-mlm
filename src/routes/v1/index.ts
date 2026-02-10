import express, { Router } from "express";
import health from "./health";
import authRouter from "./auth";
import userRouter from "@/api/v1/Users/Users.routes";

const v1: Router = express.Router();

v1.use("/health", health);
v1.use("/auth", authRouter);
v1.use("/users", userRouter);

export default v1;
