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

export const getLastNode = async (
  userId: number,
  legPosition: "LEFT" | "RIGHT",
): Promise<number | null> => {
  const immediateChild = await getImmediateChild(userId, legPosition);
  if (!immediateChild) return null;

  const basePath = immediateChild.lineagePath;

  const lastNode = await prisma.user.findFirst({
    where: {
      OR: [
        { lineagePath: basePath },
        { lineagePath: { startsWith: basePath + "," } },
      ],
    },
    orderBy: [{ lineagePath: "desc" },{ id: "desc" },],
    select: {
      id: true,
    },
  });

  return lastNode?.id ?? null;
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

export const updateAncestorLastNodes = async (
  placementParentId: number,
  legPosition: "LEFT" | "RIGHT",
) => {
  // get lineagePath of placement parent
  const parent = await prisma.user.findUnique({
    where: { id: placementParentId },
    select: { lineagePath: true },
  });

  if (!parent) return;

  // ancestors including parent
  const ancestorIds = parent.lineagePath
    .split(",")
    .map(Number)
    .filter(Number.isFinite);

  // update bottom → top
  for (const ancestorId of ancestorIds.reverse()) {
    const lastNodeId = await getLastNode(ancestorId, legPosition);

    await prisma.user.update({
      where: { id: ancestorId },
      data: {
        lastLeftId:
          legPosition === "LEFT" ? lastNodeId : undefined,
        lastRightId:
          legPosition === "RIGHT" ? lastNodeId : undefined,
      },
    });
  }
};

