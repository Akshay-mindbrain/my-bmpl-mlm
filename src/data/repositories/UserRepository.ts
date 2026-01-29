import prisma from "../../prisma-client";
import { User, Prisma } from "@prisma/client";

export const createUser = async (
  data: Prisma.UserCreateInput,
  adminId: number,
): Promise<User> => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data });
    await tx.userActivityLog.create({
      data: {
        userId: user.id,
        adminId: adminId,
        action: "CREATE",
        details: `Created user ${user.username}`,
      },
    });
    return user;
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getUserByUsername = async (
  username: string,
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const listUsersByAdmin = async (adminId: number): Promise<User[]> => {
  return prisma.user.findMany({
    where: { adminId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateUser = async (
  id: number,
  data: Prisma.UserUpdateInput,
  adminId: number,
): Promise<User> => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data,
    });
    await tx.userActivityLog.create({
      data: {
        userId: user.id,
        adminId: adminId,
        action: "UPDATE",
        details: `Updated user ${user.username} fields`,
      },
    });
    return user;
  });
};

export const deleteUser = async (
  id: number,
  adminId: number,
): Promise<User> => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.delete({
      where: { id },
    });
    await tx.userActivityLog.create({
      data: {
        userId: null,
        adminId: adminId,
        action: "DELETE",
        details: `Deleted user ${user.username} (ID: ${id})`,
      },
    });
    return user;
  });
};
