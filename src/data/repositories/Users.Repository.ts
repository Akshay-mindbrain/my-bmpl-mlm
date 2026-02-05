import prisma from "../../prisma-client";
import { User, Prisma } from "@prisma/client";

export const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByMobile = async (mobile: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { mobile },
  });
};

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateUser = async (
  id: number,
  data: Prisma.UserUpdateInput,
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const incrementDirectCount = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      directCount: {
        increment: 1,
      },
    },
  });
};

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const countUsers = async (): Promise<number> => {
  return prisma.user.count();
};

// export const findPlacementParent = async (
//   sponsorId: number,
//   legPosition: "LEFT" | "RIGHT",
// ) => {
//   let current = await prisma.user.findUnique({
//     where: { id: sponsorId },
//   });

//   if (!current) return null;

//   while (true) {
//     if (legPosition === "LEFT" && current.leftChildId === null) {
//       return current;
//     }

//     if (legPosition === "RIGHT" && current.rightChildId === null) {
//       return current;
//     }

//     const nextId =
//       legPosition === "LEFT" ? current.leftChildId: current.rightChildId;

//     if (!nextId) return current;

//     current = await prisma.user.findUnique({
//       where: { id: nextId },
//     });

//     if (!current) return null;
//   }
// };

export const createRootLineage = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      lineagePath: `${userId}`,
    },
  });
};

export const createChildLineage = async ({
  userId,
  parentId,
}: {
  userId: number;
  parentId: number;
}) => {
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: { lineagePath: true },
  });

  if (!parent) {
    throw new Error("Parent not found for lineage creation");
  }

  const lineagePath = parent.lineagePath
    ? `${parent.lineagePath},${userId}`
    : `${parentId}.${userId}`;

  return prisma.user.update({
    where: { id: userId },
    data: { lineagePath },
  });
};

export const findPlacementParent = async (
  sponsorId: number,
  legPosition: "LEFT" | "RIGHT",
) => {
  let current = await prisma.user.findUnique({
    where: { id: sponsorId },
    select: {
      id: true,
      leftChildId: true,
      rightChildId: true,
    },
  });

  if (!current) {
    throw new Error("Sponsor not found");
  }

  while (true) {
    if (legPosition === "LEFT" && current.leftChildId === null) {
      return current.id;
    }

    if (legPosition === "RIGHT" && current.rightChildId === null) {
      return current.id;
    }

    const nextId: number | null =
      legPosition === "LEFT" ? current.leftChildId : current.rightChildId;

    if (!nextId) {
      return current.id;
    }

    current = await prisma.user.findUnique({
      where: { id: nextId },
      select: {
        id: true,
        leftChildId: true,
        rightChildId: true,
      },
    });

    if (!current) {
      throw new Error("Tree corruption detected");
    }
  }
};

export const updateParentChildPointer = async ({
  parentId,
  childId,
  legPosition,
}: {
  parentId: number;
  childId: number;
  legPosition: "LEFT" | "RIGHT";
}) => {
  return prisma.user.update({
    where: { id: parentId },
    data:
      legPosition === "LEFT"
        ? {
            leftChildId: childId,
            lastLeftId: childId,
          }
        : {
            rightChildId: childId,
            lastRightId: childId,
          },
  });
};
