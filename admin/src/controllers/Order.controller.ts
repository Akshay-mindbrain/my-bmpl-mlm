import { Request, Response, NextFunction } from "express";
import {
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  updateOrderStatusUsecase,
} from "@/useCase/Order.usecase";
import AppError from "@/errors/AppError";
export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await getAllOrdersUsecase(page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    next(error);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid order ID"));
    }

    const data = await getOrderByIdUsecase(id);

    if (!data) {
      return next(AppError.notFound("Order not found"));
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    next(error);
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("Invalid order ID"));
    }

    const { status } = req.body;

    if (!status) {
      return next(AppError.badRequest("Status is required"));
    }

    const data = await updateOrderStatusUsecase(id, status);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    next(error);
  }
};
