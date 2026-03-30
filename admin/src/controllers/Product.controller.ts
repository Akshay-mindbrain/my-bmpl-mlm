import AppError from "@/errors/AppError";
import {
  createProductUsecase,
  createConfig,
  deleteProductusecase,
  getProductUsecase,
  updaateProductUsecase,
} from "@/useCase/product.usecase";
import { Request, Response, NextFunction } from "express";

export const createSkuConfigController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    const sku = await createConfig(data);

    res.status(201).json({
      success: true,
      msg: "SKU created successfully",
      data: sku,
    });
  } catch (error) {
    console.error("Create SKU Error:", error);
    next(error);
  }
};

export const productControlleer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    data.categoryId = Number(data.categoryId);
    data.subcategoryId = Number(data.subcategoryId);
    data.brandId = Number(data.brandId);

    if (!data.categoryId || !data.subcategoryId || !data.brandId) {
      return next(AppError.badRequest("Invalid category/subcategory/brand ID"));
    }

    const product = await createProductUsecase(data);

    res.status(201).json({
      success: true,
      msg: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    next(error);
  }
};

export const getProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getProductUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Products fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    next(error);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid product ID"));
    }

    const result = await updaateProductUsecase(id, req.body);

    if (!result) {
      return next(AppError.notFound("Product not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Product Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Product not found"));
    }

    next(error);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid product ID"));
    }

    await deleteProductusecase(id);

    res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Product Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("Product not found"));
    }

    next(error);
  }
};
