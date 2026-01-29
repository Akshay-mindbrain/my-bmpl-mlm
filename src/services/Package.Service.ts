import AppError from "../errors/AppError";
import * as PackageRepository from "../data/repositories/Package.Repository";
import { Packages } from "@prisma/client";

// CREATE
export const createPackage = async (
  data: any
): Promise<Packages> => {
  if (!data?.packageName || !data?.price) {
    throw AppError.badRequest("Missing required fields");
  }

  return PackageRepository.createPackage(data);
};

// GET ALL
export const getAllPackages = async (): Promise<Packages[]> => {
  return PackageRepository.getAllPackages();
};

// GET BY ID
export const getPackageById = async (
  id: string
): Promise<Packages> => {
  const pkg = await PackageRepository.getPackageById(id);

  if (!pkg) {
    throw AppError.notFound("Package not found");
  }

  return pkg;
};

// UPDATE
export const updatePackage = async (
  id: string,
  data: any
): Promise<Packages> => {
  const existing = await PackageRepository.getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  return PackageRepository.updatePackage(id, data);
};

// DELETE
export const deletePackage = async (
  id: string
): Promise<{ message: string }> => {
  const existing = await PackageRepository.getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  await PackageRepository.deletePackage(id);

  return { message: "Package deleted successfully" };
};
