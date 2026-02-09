import AppError from "../errors/AppError";
import * as KycRepository from "../data/repositories/Kyc.Repository";
import { Kyc } from "@prisma/client";

export const createKyc = async (data: any): Promise<Kyc> => {
  if (!data?.userId || !data?.aadharNo || !data?.panNo) {
    throw AppError.badRequest("Missing required fields");
  }

  return KycRepository.createKyc(data);
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

export const updateKyc = async (id: number, data: any): Promise<Kyc> => {
  const existing = await KycRepository.getKycById(id);

  if (!existing) {
    throw AppError.notFound("KYC record not found");
  }

  return KycRepository.updateKyc(id, data);
};

export const deleteKyc = async (id: number): Promise<{ message: string }> => {
  const existing = await KycRepository.getKycById(id);

  if (!existing) {
    throw AppError.notFound("KYC record not found");
  }

  await KycRepository.deleteKyc(id);

  return { message: "KYC record deleted successfully" };
};
