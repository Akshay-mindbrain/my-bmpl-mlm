import AppError from "@/errors/AppError";
import {
  getAdminConfigUsecase,
  saveAdminConfigUsecase,
} from "@/useCase/Admin.config.usecase";
import { Request, Response, NextFunction } from "express";
export const saveconfigController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await saveAdminConfigUsecase(req.body);

    if (!data) {
      return next(AppError.badRequest("Data not created or updated"));
    }

    res.status(200).json({
      success: true,
      msg: "Config managed successfully",
      data,
    });
  } catch (error) {
    console.error("Save Config Error:", error);
    next(error);
  }
};
export const getconfigController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const configData = await getAdminConfigUsecase();

    res.status(200).json({
      success: true,
      msg: "Config fetched successfully",
      data: configData,
    });
  } catch (error) {
    console.error("Get Config Error:", error);
    next(error);
  }
};
