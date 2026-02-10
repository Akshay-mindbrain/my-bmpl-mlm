import AppError from "../errors/AppError";
import * as PackageRepository from "../data/repositories/Package.Repository";
import { Packages } from "@prisma/client";
import * as adminRepository from "../data/repositories/AuthRepository"

export const createPackage = async (data: any): Promise<Packages> => {
  if (!data?.packageName || !data?.price) {
    throw AppError.badRequest("Missing required fields");
  }
   const admin = await adminRepository.getAdmin();
  if (!admin) {
    throw AppError.notFound("Admin not found");
  }

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();


  return PackageRepository.createPackage({
    ...data,
    createdBy: adminName,
    updatedBy: adminName,
    createdByAdmin: { connect: { id: admin.id } },
    updatedByAdmin: { connect: { id: admin.id } },
  });
};

export const getAllPackages = async (): Promise<Packages[]> => {
  return PackageRepository.getAllPackages();
};

export const getPackageById = async (id: string): Promise<Packages> => {
  const pkg = await PackageRepository.getPackageById(id);

  if (!pkg) {
    throw AppError.notFound("Package not found");
  }

  return pkg;
};

export const updatePackage = async (
  id: string,
  data: any,
): Promise<Packages> => {
  const existing = await PackageRepository.getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  const admin = await adminRepository.getAdmin();
  if (!admin) {
    throw AppError.notFound("Admin not found");
  }

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();

  return PackageRepository.updatePackage(id, {
    ...data,
    updatedBy: adminName,
    updatedByAdmin: {
      connect: { id: admin.id },
    },
  });
};

export const deletePackage = async (
  id: string,
): Promise<{ message: string }> => {
  const existing = await PackageRepository.getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  await PackageRepository.deletePackage(id);

  return { message: "Package deleted successfully" };
};
