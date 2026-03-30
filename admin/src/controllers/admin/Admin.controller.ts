import { Request, Response, NextFunction } from "express";
import { UpdateAdminDTO } from "@/dto";
import AppError from "@/errors/AppError";
import jwt from "jsonwebtoken";
import config from "@/config";
import {
  deleteAdminUsecase,
  getAdminUsecase,
  updateAdminUsecase,
} from "@/useCase/Admin.services";
import { MyJwtPayload } from "@/middleware/verifyToken";

export const getAdmincontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(AppError.unauthorized("Token not found"));
    }

    const decode = jwt.verify(
      token,
      config.jwtAccessSecret as string,
    ) as MyJwtPayload;

    if (!decode?.id) {
      return next(AppError.unauthorized("Unauthorized"));
    }

    const admin = await getAdminUsecase(decode.id);

    if (!admin) {
      return next(AppError.notFound("Admin not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);
    next(error);
  }
};

export const updateAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const updatedAdmin: UpdateAdminDTO = await updateAdminUsecase(id, req.body);

    res.status(200).json({
      success: true,
      msg: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error: any) {
    console.error("Update Admin Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Admin not found"));
    }

    next(error);
  }
};

export const deleteAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    await deleteAdminUsecase(id);

    res.status(200).json({
      success: true,
      msg: "Admin deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Admin Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Admin not found"));
    }

    next(error);
  }
};
