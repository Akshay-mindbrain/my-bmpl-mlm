//This is Plan_master Services [if required change the naming of this service in future]
import AppError from "../errors/AppError";
import * as PackageRepository from "../data/repositories/Package.Repository";
import { PlansMaster } from "@prisma/client";
import { getAdmin } from "@/data/repositories/Auth.admin.repository";

export const createPackage = async (
  adminId: number,
  data: any,
): Promise<PlansMaster> => {
  if (!data?.planName || !data?.price) {
    throw AppError.badRequest("Missing required fields");
  }
  const admin = await getAdmin(adminId);
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

export const getAllPlansMaster = async (): Promise<PlansMaster[]> => {
  return PackageRepository.getAllPlansMaster();
};

export const getPackageById = async (id: string): Promise<PlansMaster> => {
  const pkg = await PackageRepository.getPackageById(id);

  if (!pkg) {
    throw AppError.notFound("Package not found");
  }

  return pkg;
};

export const updatePackage = async (
  id: string,
  data: any,
  adminId: number,
): Promise<PlansMaster> => {
  const existing = await PackageRepository.getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  const admin = await getAdmin(adminId);
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
  const existing = await getPackageById(id);

  if (!existing) {
    throw AppError.notFound("Package not found");
  }

  await PackageRepository.deletePackage(id);

  return { message: "Package deleted successfully" };
};
