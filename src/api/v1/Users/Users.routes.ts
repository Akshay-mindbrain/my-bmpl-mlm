import authenticateUser from "@/middleware/authenticate-user";
import validateRequest from "@/middleware/validate-request";
import express from "express";
import * as userController from "../../../controllers/Users.controller";

import Joi from "joi";

const userRouter = express.Router();

const userSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),

  mobile: Joi.string()
    .max(10)
    .pattern(/^[0-9]+$/)
    .required(),

  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),

  sponsorId: Joi.number().integer().positive().optional().allow(null),
  parentId: Joi.number().integer().positive().optional().allow(null),

  legPosition: Joi.string().valid("LEFT", "RIGHT").optional().allow(null),

//   leftChildId: Joi.number().integer().positive().optional().allow(null),
//   rightChildId: Joi.number().integer().positive().optional().allow(null),
//   lastLeftId: Joi.number().integer().positive().optional().allow(null),
//   lastRightId: Joi.number().integer().positive().optional().allow(null),

//   lineagePath: Joi.string().max(255).optional(),

  directCount: Joi.number().integer().min(0).default(0),

  kycStatus: Joi.string().valid("PENDING", "APPROVED", "REJECT").default("PENDING"),

  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),

  createdBy: Joi.string().optional().allow(null),
  updatedBy: Joi.string().optional().allow(null),
});

const updateSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),

  mobile: Joi.string()
    .max(20)
    .pattern(/^[0-9]+$/)
    .required(),

  email: Joi.string().email().required(),

  kycStatus: Joi.string().valid("PENDING", "APPROVED", "REJECT").default("PENDING"),

  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),

  updatedBy: Joi.string().optional().allow(null),
});

// userRouter.use(authenticateUser);
userRouter.post("/", validateRequest(userSchema), userController.create);
userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);
userRouter.put("/:id", validateRequest(updateSchema), userController.update);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
