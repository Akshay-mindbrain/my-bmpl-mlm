import AppError from "@/errors/AppError";
import { dasbordUsecase } from "@/useCase/Admin.dashboard.usecase";
import { Request, Response, NextFunction } from "express";

export const dasboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dasbordUsecase();
    res.status(201).json({ msg: "dashboard fetch sucessfully", data });
  } catch (error) {
    next(error);
  }
};
