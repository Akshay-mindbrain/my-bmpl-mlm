import prisma from "@/prisma-client";
import { CreateConfigDto } from "@/dto";
import { ApproveStatus } from "@prisma/client";

export const createConfigRepo = async (data: CreateConfigDto) => {
  const { royalPlanIds, ...rest } = data;

  return prisma.config.upsert({
    where: { id: 1 },
    update: {
      ...rest,
      royalQualifierPlans: royalPlanIds
        ? {
            set: royalPlanIds.map((id) => ({ id })),
          }
        : undefined,
    },
    create: {
      id: 1,
      plan_config_key: "PLAN_APPROVAL_MODE",
      plan_config_value: ApproveStatus.AUTO,
      ...rest,
      royalQualifierPlans: royalPlanIds
        ? {
            connect: royalPlanIds.map((id) => ({ id })),
          }
        : undefined,
    },
  });
};

export const getConfigRepo = async () => {
  return prisma.config.findUnique({
    where: { id: 1 },
    include: {
      royalQualifierPlans: true,
    },
  });
};
