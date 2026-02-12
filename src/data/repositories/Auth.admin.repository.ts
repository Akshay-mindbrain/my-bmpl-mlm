import prisma from "@/prisma-client";

export const findByMobile = async (mobile: string) => {
  return prisma.admin.findUnique({
    where: { mobile },
  });
};
export const findById = async (id: number) => {
  if (!id) {
    throw new Error("Admin ID is required");
  }

  return prisma.admin.findUnique({
    where: { id },
  });
};

export const storeRefreshToken = (id: number, refrshToken: string) => {
  return prisma.admin.update({
    where: { id },
    data: { refreshToken: refrshToken },
  });
};
export const getAdmin = async (id: number): Promise<any> => {
  if (!id) {
    throw new Error("Admin ID is required");
  }

  return prisma.admin.findUnique({
    where: { id },
  });
};
