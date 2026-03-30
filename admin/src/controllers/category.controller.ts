import AppError from "@/errors/AppError";
import {
  createCategoriesUsecase,
  deleteCatagoryUsecase,
  getCategoryUsecase,
  updateCategoryusecase,
} from "@/useCase/category.usecase";
import { Request, Response, NextFunction } from "express";

export const createCategoriescontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    const category = await createCategoriesUsecase(data);

    if (!category) {
      return next(AppError.badRequest("Category not created"));
    }

    res.status(201).json({
      success: true,
      msg: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    next(error);
  }
};
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getCategoryUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Categories fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    next(error);
  }
};

export const updateCategorycontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    const category = await updateCategoryusecase(id, req.body);

    if (!category) {
      return next(AppError.notFound("Category not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Update Category Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Category not found"));
    }

    next(error);
  }
};
export const deleteCatagorycontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid ID"));
    }

    await deleteCatagoryUsecase(id);

    res.status(200).json({
      success: true,
      msg: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Category Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Category not found"));
    }

    next(error);
  }
};
