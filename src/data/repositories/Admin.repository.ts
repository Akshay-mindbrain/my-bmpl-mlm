import express from "express";
import prisma from "@/prisma-client";

export const createAdminRepo = (data: any) => {
  return prisma.admin.create({
    data,
  });
};

export const findbymobile = (mobile: string) => {
  return prisma.admin.findUnique({
    where: { mobile },
  });
};

export const getAdminRepo = () => {
  return prisma.admin.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      username: true,
      adminType: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      refreshToken: false,
      password: false,
    },
  });
};

export const updateAdminRepo = async (id: number, data: any) => {
  return await prisma.admin.update({ where: { id }, data });
};

export const deleteAdminRepo = async (id: number) => {
  return await prisma.admin.delete({
    where: { id },
  });
};
