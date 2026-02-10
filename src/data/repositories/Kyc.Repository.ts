import prisma from "../../prisma-client";
import { Kyc, Prisma } from "@prisma/client";

export const createKyc = async (data: Prisma.KycCreateInput): Promise<Kyc> => {
  return prisma.kyc.create({ data });
};

export const getAllKyc = async (): Promise<Kyc[]> => {
  return prisma.kyc.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getKycById = async (id: number): Promise<Kyc | null> => {
  return prisma.kyc.findUnique({
    where: { id },
  });
};

export const getKycByUserId = async (userId: number): Promise<Kyc | null> => {
  return prisma.kyc.findUnique({
    where: { userId },
  });
};

export const updateKyc = async (
  id: number,
  data: Prisma.KycUpdateInput,
): Promise<Kyc> => {
  return prisma.kyc.update({
    where: { id },
    data,
  });
};

export const deleteKyc = async (id: number): Promise<Kyc> => {
  return prisma.kyc.delete({
    where: { id },
  });
};
