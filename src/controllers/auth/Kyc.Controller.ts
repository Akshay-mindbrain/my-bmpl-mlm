import { Request, Response, NextFunction } from "express";
import {
  createKyc,
  deleteKyc,
  getAllKyc,
  getKycById,
  getKycByUserId,
  updateKyc,
} from "@/useCase/Kyc.Service";

export const createKycController = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any)?.user?.id;

    console.log("Admin ID from token:", adminId);

    if (!adminId) {
      res.status(401).json({
        msg: "Admin not authenticated",
      });
      return;
    }

    const result = await createKyc({
      ...req.body,
      adminId,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllKycController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllKyc();

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

    const result = await getKycById(Number(id));

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

    const result = await getKycByUserId(Number(userId));

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
    const adminId = (req as any)?.user.id;
    if (!adminId) {
      res.status(404).json({ msg: "adminId not found" });
    }

    const result = await updateKyc(Number(id), adminId, req.body);

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

    const result = await deleteKyc(Number(id));

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
