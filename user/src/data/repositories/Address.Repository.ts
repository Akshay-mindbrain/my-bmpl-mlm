import prisma from "../../prisma-client";

export const createUserAddress = async (data: {
  userId: number;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}) => {
  if (data.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: data.userId },
      data: { isDefault: false },
    });
  }

  return prisma.userAddress.create({
    data,
  });
};

export const getUserAddresses = async (userId: number) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAddressById = async (id: number) => {
  return prisma.userAddress.findUnique({
    where: { id },
  });
};

export const updateAddress = async (id: number, data: any) => {
  if (data.isDefault) {
    const address = await prisma.userAddress.findUnique({ where: { id } });
    if (address) {
      await prisma.userAddress.updateMany({
        where: { userId: address.userId },
        data: { isDefault: false },
      });
    }
  }
  return prisma.userAddress.update({
    where: { id },
    data,
  });
};

export const deleteAddress = async (id: number) => {
  return prisma.userAddress.delete({
    where: { id },
  });
};
