import { Request, Response, NextFunction } from "express";
import * as planPurchaseService from "../useCase/PlanPurchase.Service";

export const createPlanPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const purchase = await planPurchaseService.createPlanPurchase(req.body);

    res.status(201).json({
      success: true,
      message: "Plan purchase created successfully.",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPlanPurchases = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const purchases = await planPurchaseService.getAllPlanPurchases();

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlanPurchaseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const purchase = await planPurchaseService.getPlanPurchaseById(id);

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchasesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const purchases = await planPurchaseService.getPurchasesByUser(userId);

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchasesByPlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const planId = req.params.planId;
    const purchases = await planPurchaseService.getPurchasesByPlan(planId);

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingApprovals = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const purchases = await planPurchaseService.getPendingApprovals();

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

export const approvePurchase = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const purchaseId = Number(req.params.id);
    const { adminId } = req.body;

    const purchase = await planPurchaseService.approvePurchase(
      purchaseId,
      adminId,
    );

    res.status(200).json({
      success: true,
      message: "Purchase approved successfully.",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

export const markIncomeGenerated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const purchaseId = Number(req.params.id);

    const purchase = await planPurchaseService.markIncomeGenerated(purchaseId);

    res.status(200).json({
      success: true,
      message: "Income marked as generated.",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};
