import prisma from "../../prisma-client";
import { Packages, Prisma } from "@prisma/client";


export const createPackage = async (
  data:any
): Promise<Packages> => {
  return prisma.packages.create({ data });
};


export const getAllPackages = async (): Promise<Packages[]> => {
  return prisma.packages.findMany({
    orderBy: { packageName: "asc" },
  });
};


export const getPackageById = async (
  id: string
): Promise<Packages | null> => {
  return prisma.packages.findUnique({
    where: { id },
  });
};


export const updatePackage = async (
  id: string,
  data: any
): Promise<Packages> => {
  return prisma.packages.update({
    where: { id },
    data,
  });
};


export const deletePackage = async (
  id: string
): Promise<Packages> => {
  return prisma.packages.delete({
    where: { id },
  });
};
