import { validate } from "./../../../middleware/validate-request";
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
import { adminRegisterSchema } from "@/data/request-schemas";
import { verifyAdmin } from "@/middleware/verifyToken";
import { ratelimitlogin } from "@/utils/limiter";
import express from "express";

export const adminRouter = express.Router();
adminRouter.post(
  "/register",
  validate(adminRegisterSchema),
  createAdmincontroller,
);
adminRouter.post("/login", ratelimitlogin, loginController);
adminRouter.post("/refresh", ratelimitlogin, genAccessToken);
adminRouter.get("/get", verifyAdmin, getAdmincontroller);
adminRouter.put("/update/:id", verifyAdmin, updateAdminController);
adminRouter.delete("/delete/:id", verifyAdmin, deleteAdminController);
