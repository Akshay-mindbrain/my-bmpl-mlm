import express, { Router } from "express";
import health from "./health";
//import authRouter from "./auth";
import { adminRouter } from "./Admin/Admin.routes";
import kycrouter from "./KYC/Kyc.routes";
import packagerouter from "./Packages/package.routes";
const v1: Router = express.Router();

v1.use("/health", health);

//v1.use("/auth", authRouter);

//admin protected routes

v1.use("/admin", adminRouter);
v1.use("/kyc", kycrouter);
v1.use("/package", packagerouter);

export default v1;
