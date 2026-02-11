import {
  genAccessToken,
  loginController,
} from "@/controllers/auth/auth.controller";
import express from "express";

export const adminRouter = express.Router();

adminRouter.post("/login", loginController);
adminRouter.post("/refresh", genAccessToken);
