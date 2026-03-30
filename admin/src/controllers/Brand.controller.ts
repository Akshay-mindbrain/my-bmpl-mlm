import AppError from "@/errors/AppError";
import {
  createBrandUsecase,
  deleteBrandusecase,
  getBrandUsecase,
  updateBrandusease,
} from "@/useCase/brand.usecase";
import { Request, Response, NextFunction } from "express";

export const createBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    data.subcategoryId = Number(data.subcategoryId);

    if (!data.subcategoryId) {
      return next(AppError.badRequest("Invalid subcategoryId"));
    }

    const brand = await createBrandUsecase(data);

    res.status(201).json({
      success: true,
      msg: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Create Brand Error:", error);
    next(error);
  }
};

export const getBrandsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getBrandUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Brands fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);
    next(error);
  }
};
export const updateBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const result = await updateBrandusease(id, req.body);

    if (!result) {
      return next(AppError.notFound("Brand not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Brand updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Brand Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Brand not found"));
    }

    next(error);
  }
};
export const deleteBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    await deleteBrandusecase(id);

    res.status(200).json({
      success: true,
      msg: "Brand deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Brand Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Brand not found"));
    }

    next(error);
  }
};
