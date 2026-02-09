import { Request, Response, NextFunction } from "express";
import * as PackageService from "../useCase/Package.Service";

export const createPackageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await PackageService.createPackage(req.body);

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
    const result = await PackageService.getAllPackages();

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

    const result = await PackageService.getPackageById(id);

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

    const result = await PackageService.updatePackage(id, req.body);

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

    const result = await PackageService.deletePackage(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
