import express, { Router } from "express";
import health from "./health";
//import authRouter from "./auth";
import { adminRouter } from "./Admin/Admin.routes";
const v1: Router = express.Router();

v1.use("/health", health);

//v1.use("/auth", authRouter);

//admin protected routes

v1.use("/admin", adminRouter);

export default v1;
