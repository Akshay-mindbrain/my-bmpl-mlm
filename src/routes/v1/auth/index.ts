import express from "express";
import {
  genAccessToken,
  loginController,
} from "@/controllers/auth/auth.user.controller";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/refresh", genAccessToken);

export default authRouter;
