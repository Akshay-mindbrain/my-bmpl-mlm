import { Request, Response, NextFunction } from "express";
import {
  calculateTotalBvUsecase,
  getLastMonthTeamBVUsecase,
  getSelfbvUsecase,
  getTotalFirstpurchesBvusecase,
  getTotalRepurchaseBVUsecase,
} from "@/useCase/totalbv.usecase";
import AppError from "@/errors/AppError";

export const getUserTotalBVController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const result = await calculateTotalBvUsecase(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Total BV Error:", error);
    next(error);
  }
};

export const getLastMonthTeamBVController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const result = await getLastMonthTeamBVUsecase(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Last Month BV Error:", error);
    next(error);
  }
};

export const getTotalRepurchaseBVController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const result = await getTotalRepurchaseBVUsecase(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Repurchase BV Error:", error);
    next(error);
  }
};

export const getTotalFirstpurchaseBVController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const result = await getTotalFirstpurchesBvusecase(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("First Purchase BV Error:", error);
    next(error);
  }
};

export const getSelfBVController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const result = await getSelfbvUsecase(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Self BV Error:", error);
    next(error);
  }
};
