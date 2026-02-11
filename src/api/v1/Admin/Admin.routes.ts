import {
  createAdmincontroller,
  deleteAdminController,
  getAdmincontroller,
  updateAdminController,
} from "@/controllers/auth/Admin.controller";
import {
  genAccessToken,
  loginController,
} from "@/controllers/auth/auth.controller";
import { verifyAdmin } from "@/middleware/verifyToken";
import express from "express";

export const adminRouter = express.Router();
adminRouter.post("/register", createAdmincontroller);
adminRouter.post("/login", loginController);
adminRouter.post("/refresh", genAccessToken);
adminRouter.get("/get", verifyAdmin, getAdmincontroller);
adminRouter.put("/update/:id", verifyAdmin, updateAdminController);
adminRouter.delete("/delete/:id", verifyAdmin, deleteAdminController);
