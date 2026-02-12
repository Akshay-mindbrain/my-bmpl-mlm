import AppError from "../errors/AppError";
import * as KycRepository from "../data/repositories/Kyc.Repository";
import { Kyc } from "@prisma/client";
import { getAdmin } from "@/data/repositories/Auth.admin.repository";
export const createKyc = async (data: any): Promise<Kyc> => {
  if (!data?.userId || !data?.aadharNo || !data?.panNo) {
    throw AppError.badRequest("Missing required fields");
  }

  const admin = await getAdmin(data.adminId);
  if (!admin) {
    throw AppError.notFound("Admin not found");
  }

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();

  const { userId, adminId, ...kycData } = data;

  return KycRepository.createKyc({
    ...kycData,
    user: {
      connect: { id: userId },
    },

    createdBy: adminName,
    updatedBy: adminName,

    createdByAdmin: {
      connect: { id: admin.id },
    },
    updatedByAdmin: {
      connect: { id: admin.id },
    },
  });
};

export const getAllKyc = async (): Promise<Kyc[]> => {
  return KycRepository.getAllKyc();
};

export const getKycById = async (id: number): Promise<Kyc> => {
  const kyc = await KycRepository.getKycById(id);

  if (!kyc) {
    throw AppError.notFound("KYC record not found");
  }

  return kyc;
};

export const getKycByUserId = async (userId: number): Promise<Kyc> => {
  const kyc = await KycRepository.getKycByUserId(userId);

  if (!kyc) {
    throw AppError.notFound("KYC record not found for this user");
  }

  return kyc;
};

export const updateKyc = async (
  id: number,
  adminId: number,
  data: any,
): Promise<Kyc> => {
  const existing = await KycRepository.getKycById(id);

  if (!existing) {
    throw AppError.notFound("KYC record not found");
  }

  const admin = await getAdmin(adminId);
  if (!admin) {
    throw AppError.notFound("Admin not found");
  }

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();

  return KycRepository.updateKyc(id, {
    ...data,
    updatedBy: adminName,
    approvedByAdmin: {
      connect: { id: admin.id },
    },
    updatedByAdmin: {
      connect: { id: admin.id },
    },
  });
};

export const deleteKyc = async (id: number): Promise<{ message: string }> => {
  const existing = await KycRepository.getKycById(id);

  if (!existing) {
    throw AppError.notFound("KYC record not found");
  }

  await KycRepository.deleteKyc(id);

  return { message: "KYC record deleted successfully" };
};

export const approveKyc = async (id: number): Promise<Kyc> => {
  const existing = await KycRepository.getKycById(id);

  if (!existing) {
    throw AppError.notFound("KYC record not found");
  }

  const admin = await getAdmin(id);
  if (!admin) {
    throw AppError.notFound("Admin not found");
  }

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();

  return KycRepository.updateKyc(id, {
    status: "APPROVED",
    updatedBy: adminName,

    updatedByAdmin: {
      connect: { id: admin.id },
    },

    approvedByAdmin: {
      connect: { id: admin.id },
    },
  });
};
