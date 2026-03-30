import AppError from "@/errors/AppError";
import prisma from "@/prisma-client";
import {
  createPlanUsecase,
  deleteplanusecase,
  getplanByIdUsecase,
  getPlanUsecase,
  updatePlanUSecase,
} from "@/useCase/Admin.planmaster.usecase";
import { Request, Response, NextFunction } from "express";
export const createPlancontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { planName, Description, BV, price, dp_amount, features } = req.body;

    const isExistplan = await prisma.plansMaster.findUnique({
      where: { planName },
    });

    if (isExistplan) {
      return next(AppError.conflict("Plan already exists"));
    }

    const plan = await createPlanUsecase({
      planName,
      Description,
      BV,
      price,
      dp_amount,
      features,
    });

    res.status(201).json({
      success: true,
      msg: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Create Plan Error:", error);
    next(error);
  }
};

export const getplancontroller = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plan = await getPlanUsecase();

    if (!plan) {
      return next(AppError.notFound("Plan not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Get Plan Error:", error);
    next(error);
  }
};

export const getPlanbyidcontrooler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const plan = await getplanByIdUsecase(id);

    if (!plan) {
      return next(AppError.notFound("Plan not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Get Plan By ID Error:", error);
    next(error);
  }
};

export const updatePlancontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const updateplan = await updatePlanUSecase(id, req.body);

    if (!updateplan) {
      return next(AppError.notFound("Plan not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Plan updated successfully",
      data: updateplan,
    });
  } catch (error) {
    console.error("Update Plan Error:", error);
    next(error);
  }
};

export const deleteplancontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    await deleteplanusecase(id);

    res.status(200).json({
      success: true,
      msg: "Plan deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Plan Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Plan not found"));
    }

    next(error);
  }
};
