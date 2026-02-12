import { User } from "@prisma/client";
//This is Plan_master Controller [if required change the naming of this Controller in future]
import { Request, Response, NextFunction } from "express";
import {
  createPackage,
  deletePackage,
  getAllPlansMaster,
  getPackageById,
  updatePackage,
} from "@/useCase/Package.Service";

export const createPackageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const adminId = (req as any)?.user?.id;

    if (!adminId) {
      res.status(404).json({ msg: "Admin ID not found" });
      return;
    }

    const result = await createPackage(adminId, req.body);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPackagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllPlansMaster();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPackageByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await getPackageById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePackageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const adminId = (req as any).user?.id;

    const result = await updatePackage(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePackageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await deletePackage(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
