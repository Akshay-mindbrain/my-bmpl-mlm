import express from "express";
import * as planPurchaseController from "../../../controllers/PlanPurchase.Controller";

const planPurchaseRouter = express.Router();

planPurchaseRouter.post("/", planPurchaseController.createPlanPurchase);

planPurchaseRouter.get("/", planPurchaseController.getAllPlanPurchases);

planPurchaseRouter.get("/:id", planPurchaseController.getPlanPurchaseById);

planPurchaseRouter.get(
  "/user/:userId",
  planPurchaseController.getPurchasesByUser,
);

planPurchaseRouter.get(
  "/plan/:planId",
  planPurchaseController.getPurchasesByPlan,
);

planPurchaseRouter.get(
  "/pending/approvals",
  planPurchaseController.getPendingApprovals,
);

planPurchaseRouter.put("/:id/approve", planPurchaseController.approvePurchase);

planPurchaseRouter.put(
  "/:id/income-generated",
  planPurchaseController.markIncomeGenerated,
);

export default planPurchaseRouter;
