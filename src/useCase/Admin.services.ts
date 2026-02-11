import bcrypt from "bcryptjs";
import {
  createAdminRepo,
  deleteAdminRepo,
  getAdminRepo,
  updateAdminRepo,
} from "@/data/repositories/Admin.repository";
import { AdminType } from "@prisma/client";
import { findByMobile } from "@/data/repositories/Auth.admin.repository";
import prisma from "@/prisma-client";

export const createAdminServices = async (data: any) => {
  const [mobileExists, emailExists] = await Promise.all([
    prisma.admin.findUnique({ where: { mobile: data.mobile } }),
    prisma.admin.findUnique({ where: { email: data.email } }),
  ]);

  if (mobileExists) throw { status: 400, message: "Mobile already exists" };

  if (emailExists) throw { status: 400, message: "Email already exists" };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  return createAdminRepo({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    mobile: data.mobile,
    username: data.mobile,
    password: hashedPassword,
    adminType: AdminType.SUPERADMIN,
  });
};

export const getAdminServices = () => {
  return getAdminRepo();
};

export const updateAdmin = async (id: number, data: any) => {
  return await updateAdminRepo(id, data);
};

export const deleteAdmin = async (id: number) => {
  return await deleteAdminRepo(id);
};
