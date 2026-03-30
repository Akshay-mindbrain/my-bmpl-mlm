import AppError from "@/errors/AppError";
import {
  generatePayoutUsecase,
  getPayoutDetailsUsecase,
  payoutHistoryUsecase,
  payoutUsecase,
} from "@/useCase/payout.usecase";
import { Request, Response, NextFunction } from "express";

export const generatePayoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await generatePayoutUsecase();

    res.status(200).json({
      success: true,
      msg: "Payout generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Generate Payout Error:", error);
    next(error);
  }
};

export const payoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await payoutUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Payout found successfully",
      data,
    });
  } catch (error) {
    console.error("Payout List Error:", error);
    next(error);
  }
};

export const payouthistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await payoutHistoryUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Payout history found successfully",
      data,
    });
  } catch (error) {
    console.error("Payout History Error:", error);
    next(error);
  }
};

export const getPayoutDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payoutId = Number(req.params.id);

    if (isNaN(payoutId)) {
      return next(AppError.badRequest("Invalid payout ID"));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await getPayoutDetailsUsecase(payoutId, page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Payout Details Error:", error);
    next(error);
  }
};
