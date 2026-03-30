import AppError from "@/errors/AppError";
import {
  createSubCategoryUsecase,
  deleteSubcategoryUsecase,
  getSubCategoryusecase,
  updateSubCategoryUsecase,
} from "@/useCase/subcategory.usecase";
import { Request, Response, NextFunction } from "express";

export const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    data.categoryId = Number(data.categoryId);

    if (!data.categoryId) {
      return next(AppError.badRequest("Invalid category ID"));
    }

    const result = await createSubCategoryUsecase(data);

    res.status(201).json({
      success: true,
      msg: "Subcategory created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Subcategory Error:", error);
    next(error);
  }
};

export const getSubCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getSubCategoryusecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Subcategories fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Get Subcategories Error:", error);
    next(error);
  }
};

export const updateSubCategorycontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const result = await updateSubCategoryUsecase(id, req.body);

    if (!result) {
      return next(AppError.notFound("Subcategory not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Subcategory updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Subcategory Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Subcategory not found"));
    }

    next(error);
  }
};

export const deleteSubcategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    await deleteSubcategoryUsecase(id);

    res.status(200).json({
      success: true,
      msg: "Subcategory deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Subcategory Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Subcategory not found"));
    }

    next(error);
  }
};
