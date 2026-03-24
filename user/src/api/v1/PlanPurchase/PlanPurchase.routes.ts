import express from "express";
import * as planPurchaseController from "../../../controllers/PlanPurchase.Controller";
import validateRequest from "@/middleware/validate-request";
import {
  planPurchaseCreateSchema,
  planPurchaseUpdateSchema,
} from "@/data/request-schemas";
import { verifyUser, verifyAdmin } from "@/middleware/verifyToken";

const planPurchaseRouter = express.Router();

planPurchaseRouter.post(
  "/",
  verifyUser,
  validateRequest(planPurchaseCreateSchema),
  planPurchaseController.createPlanPurchase,
);

planPurchaseRouter.get(
  "/my-purchases",
  verifyUser,
  planPurchaseController.getPurchasesByUser,
);

planPurchaseRouter.get(
  "/details/pending",
  verifyAdmin,
  planPurchaseController.getPendingApprovals,
);

planPurchaseRouter.get(
  "/details/:id",
  verifyUser,
  planPurchaseController.getPlanPurchaseById,
);

planPurchaseRouter.put(
  "/approve/:id",
  verifyAdmin,
  planPurchaseController.approvePurchase,
);

export default planPurchaseRouter;
