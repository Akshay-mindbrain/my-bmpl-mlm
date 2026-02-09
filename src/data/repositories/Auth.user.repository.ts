import prisma from "@/prisma-client";

export const findByMobile = async (mobile: string) => {
  return prisma.user.findUnique({
    where: { mobile },
  });
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const storeRefreshToken = (id: number, refrshToken: string) => {
  return prisma.user.update({
    where: { id },
    data: { refresh_token: refrshToken },
  });
};
