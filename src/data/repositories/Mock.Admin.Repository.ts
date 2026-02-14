//This is a mock to have a crud functionality of already seeded admin 

import prisma from "../../prisma-client";
import { Admin, Prisma } from "@prisma/client";

export const create = async (data: Prisma.AdminCreateInput): Promise<Admin> => {
  return prisma.admin.create({ data });
};

export const getAllAdmins = async (): Promise<Admin[]> => {
  return prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id: number): Promise<Admin | null> => {
  return prisma.admin.findUnique({
    where: { id },
  });
};

export const findByEmail = async (email: string): Promise<Admin | null> => {
  return prisma.admin.findUnique({
    where: { email },
  });
};

export const findByUsername = async (
  username: string,
): Promise<Admin | null> => {
  return prisma.admin.findUnique({
    where: { username },
  });
};

export const getSuperAdmins = async (): Promise<Admin[]> => {
  return prisma.admin.findMany({
    where: {
      adminType: "SUPERADMIN",
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  });
};
