import validateRequest from "@/middleware/validate-request";
import express from "express";
import * as userController from "../../../controllers/Users.controller";
import { userCreateSchema, userUpdateSchema } from "@/data/request-schemas";
import { genAccessToken, loginController } from "@/controllers/auth/auth.user.controller";

const userRouter = express.Router();

// userRouter.use(authenticateUser);

userRouter.post("/", validateRequest(userCreateSchema), userController.create);
userRouter.post("/login", loginController);
userRouter.post("/refresh", genAccessToken); 

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);
userRouter.get("/:id/downline", userController.getDownline);
userRouter.get("/:id/upline", userController.getUpline);

userRouter.get(
  "/:userId/last-node-update",
  userController.getLastNodeByLegController,
);

userRouter.put("/:id", validateRequest(userUpdateSchema), userController.update);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
