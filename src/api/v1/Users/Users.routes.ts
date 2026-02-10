import authenticateUser from "@/middleware/authenticate-user";
import validateRequest from "@/middleware/validate-request";
import express from "express";
import * as userController from "../../../controllers/Users.controller";
import { userCreateSchema, userUpdateSchema } from "@/data/request-schemas";


const userRouter = express.Router();
// userRouter.use(authenticateUser);

// console.log("Api is being hit in routes");
userRouter.post("/", validateRequest(userCreateSchema), userController.create);
userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);
userRouter.get("/:id/downline", userController.getDownline);
userRouter.get("/:id/upline", userController.getUpline);
userRouter.get(
  "/:userId/last-node-update",
  userController.getLastNodeByLegController,
); //leg position should be provided in body
userRouter.put("/:id", validateRequest(userUpdateSchema), userController.update);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
