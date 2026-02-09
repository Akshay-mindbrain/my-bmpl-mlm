import { Request, Response, NextFunction } from "express";
import * as KycService from "../services/Kyc.Service";

export const createKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await KycService.createKyc(req.body);

    res.status(201).json({
      success: true,
      message: "KYC record created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await KycService.getAllKyc();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getKycByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await KycService.getKycById(Number(id));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getKycByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const result = await KycService.getKycByUserId(Number(userId));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await KycService.updateKyc(Number(id), req.body);

    res.status(200).json({
      success: true,
      message: "KYC record updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await KycService.deleteKyc(Number(id));

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
