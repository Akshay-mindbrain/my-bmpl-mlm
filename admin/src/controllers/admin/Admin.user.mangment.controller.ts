import AppError from "@/errors/AppError";
import {
  getUsersUsecase,
  updateUserStatusUsecase,
  updateUserUsecase,
} from "@/useCase/Admin.user.mangment.usecase";
import { Request, Response, NextFunction } from "express";
export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;

    if (limit > 100) limit = 100;

    const users = await getUsersUsecase(search, page, limit);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      ...users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    next(error);
  }
};
export const updateUserstatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return next(AppError.badRequest("Invalid user ID"));
    }

    const { status } = req.body;

    if (!status) {
      return next(AppError.badRequest("Status required"));
    }

    const user = await updateUserStatusUsecase(id, status);

    res.status(200).json({
      success: true,
      msg: "Status updated successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Update Status Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("User not found"));
    }

    next(error);
  }
};
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const user = await updateUserUsecase(id, req.body);

    res.status(200).json({
      success: true,
      msg: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Update User Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("User not found"));
    }

    next(error);
  }
};
