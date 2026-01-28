import express, { Router } from "express";
import health from "./health";
import auth from "./auth";

const v1: Router = express.Router();

v1.use("/health", health);
v1.use("/auth", auth);

export default v1;
