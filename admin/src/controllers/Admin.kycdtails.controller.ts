import { Request, Response, NextFunction } from "express";
import {
  getPendingKycUsecase,
  getApprovedKycUsecase,
  getRejectedKycusecase,
  getAllKycusecase,
  getOneKycusecase,
  updateKYcstatusUsecase,
} from "@/useCase/Admin.kycdetails.usecase";
import AppError from "@/errors/AppError";
export const getPendingKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getPendingKycUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Pending KYC fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Pending KYC Error:", error);
    next(error);
  }
};
export const getApprovedKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getApprovedKycUsecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Approved KYC fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Approved KYC Error:", error);
    next(error);
  }
};
export const getRejectedKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getRejectedKycusecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "Rejected KYC fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("Rejected KYC Error:", error);
    next(error);
  }
};
export const getAllKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getAllKycusecase(page, limit);

    res.status(200).json({
      success: true,
      msg: "All KYC fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("All KYC Error:", error);
    next(error);
  }
};

export const getOneKyccontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("ID is required"));
    }

    const data = await getOneKycusecase(id);

    if (!data) {
      return next(AppError.notFound("KYC not found"));
    }

    res.status(200).json({
      success: true,
      msg: "KYC fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get One KYC Error:", error);
    next(error);
  }
};

export const updateKycStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return next(AppError.badRequest("ID is required"));
    }

    const { remark, action } = req.body;

    if (!action) {
      return next(AppError.badRequest("Action is required"));
    }

    const kycstatus = await updateKYcstatusUsecase(id, action, remark);

    res.status(200).json({
      success: true,
      msg:
        action === "APPROVE"
          ? "KYC approved successfully"
          : "KYC rejected successfully",
      data: kycstatus,
    });
  } catch (error: any) {
    console.error("Update KYC Error:", error);

    if (error.code === "P2025") {
      return next(AppError.notFound("KYC not found"));
    }

    next(error);
  }
};
