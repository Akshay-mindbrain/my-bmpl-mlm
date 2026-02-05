import { PrismaClient, Prisma, User } from "@prisma/client";
const prisma = new PrismaClient();

export const getImmediateChild = async (
  userId: number,
  legPosition: "LEFT" | "RIGHT",
) => {
  return prisma.user.findFirst({
    where: {
      parentId: userId,
      legPosition: legPosition,
    },
    select: {
      id: true,
      lineagePath: true,
    },
  });
};

export const getLastNode = async (lineagePath: string) => {
  return prisma.$queryRaw<User[]>`
    SELECT *
    FROM "User"
    WHERE "lineagePath" LIKE ${`${lineagePath}%`}
  `;
};

export const getAllDownline = async (lineagePath: string) => {
  return prisma.$queryRaw<User[]>`
    SELECT *
    FROM users
    WHERE lineagePath LIKE CONCAT(${lineagePath}, ',%');
  `;
};

export const getAllUpLine = async (lineagePath: string) => {
  const ids = lineagePath.split(",").map(Number).filter(Number.isFinite);
  return prisma.$queryRaw<User[]>`
    select * from users where id in (${Prisma.join(ids)});
    `;
};

// export const updateAncestorLastNodes = async (
//   placementParentId: number,
//   legPosition: "LEFT" | "RIGHT",
// ) => {
//   // get lineagePath of placement parent
//   const parent = await prisma.user.findUnique({
//     where: { id: placementParentId },
//     select: { lineagePath: true },
//   });

//   if (!parent) return;

//   // ancestors including parent
//   const ancestorIds = parent.lineagePath
//     .split(",")
//     .map(Number)
//     .filter(Number.isFinite);

//   // update bottom → top
//   for (const ancestorId of ancestorIds.reverse()) {
//     const lastNodeId = await getLastNode(ancestorId, legPosition);

//     await prisma.user.update({
//       where: { id: ancestorId },
//       data: {
//         lastLeftId:
//  legPosition === "LEFT" ? lastNodeId : undefined,
//         lastRightId:
//  legPosition === "RIGHT" ? lastNodeId : undefined,
//       },
//     });
//   }
// };
