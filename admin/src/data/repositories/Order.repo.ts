import prisma from "@/prisma-client";
import { OrderStatus } from "@prisma/client";

export const getAllOrdersRepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.orderPlace.findMany({
      skip,
      take: limit,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            memberId: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderPlace.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getOrderByIdRepo = async (id: number) => {
  return prisma.orderPlace.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      address: true,
    },
  });
};

export const updateOrderStatusRepo = async (id: number, status: OrderStatus) => {
  return prisma.orderPlace.update({
    where: { id },
    data: {
      orderStatus: status,
      ...(status === OrderStatus.DELIVERED ? { deliveredAt: new Date() } : {}),
    },
  });
};
