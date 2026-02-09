import express, { Request, Response } from "express";
import login from "../../../controllers/auth/auth.controller";
const authRouter = express.Router();
authRouter.post("/login", login); //getting error on login

export default authRouter;
