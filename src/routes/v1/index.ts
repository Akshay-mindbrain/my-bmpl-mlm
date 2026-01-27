import express, { Router } from "express";
import health from "./health";

const v1: Router = express.Router();

v1.use("/health", health);

export default v1;
