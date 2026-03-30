import AppError from "@/errors/AppError";
import {
  genincomeUsecase,
  getIncomeByBatchUsecase,
  incomeHistoryUsecase,
  inocomeGenerateUsecase,
} from "@/useCase/income.generate.usecase";
import { Request, Response, NextFunction } from "express";

export const IncomegenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await inocomeGenerateUsecase();

    if (!data) {
      return next(AppError.notFound("Income not generated"));
    }

    res.status(201).json({
      success: true,
      msg: "Income generated successfully",
      data,
    });
  } catch (error) {
    console.error("Generate Income Error:", error);
    next(error);
  }
};

export const generateincomeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await genincomeUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Income list fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Income List Error:", error);
    next(error);
  }
};

export const incomeHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await incomeHistoryUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Income history fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Income History Error:", error);
    next(error);
  }
};

export const getIncomeByBatchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const batchId = Number(req.params.id);

    if (!batchId) {
      return next(AppError.badRequest("Invalid batch ID"));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await getIncomeByBatchUsecase(batchId, page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Income By Batch Error:", error);
    next(error);
  }
};
