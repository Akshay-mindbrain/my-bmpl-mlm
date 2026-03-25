import prisma from "@/prisma-client";
import {
  elegibleForincome,
  getIncomePercentage,
  getTDS,
  getWalletCarryBV,
} from "@/utils/incomeHelper";
import { getUserTotalBVRepo } from "./Admin.totalbv.repo";

export const getIncomeGenarateRepo = async () => {
  const INCOME_TYPE = {
    BINARY: 1,
    ROYALTY: 2,
  };

  const eligibleUsers = await elegibleForincome();
  const incomePercentage = await getIncomePercentage();
  const { tds, admincharges } = await getTDS();

  const generateIncomeEntry = await prisma.generateIncome.create({
    data: {
      totalIncome: 0,
      netincome: 0,
      tds: 0,
      adminCharges: 0,
      generatedDate: new Date(),
    },
  });

  let totalIncome = 0;
  let totaltds = 0;
  let totalAdmincharges = 0;
  let totalNetIncome = 0;

  const result: any[] = [];

  for (const u of eligibleUsers) {
    const userId = u.user_id;

    const { leftBV, rightBV } = await getUserTotalBVRepo(userId);
    const { leftCarry, rightCarry } = await getWalletCarryBV(userId);

    // If wallet doesn't exist, carry defaults to 0 from the helper
    const totalLeft = leftBV + leftCarry;
    const totalRight = rightBV + rightCarry;

    const matchedBv = Math.min(totalLeft, totalRight);
    if (matchedBv <= 0) continue;

    const newLeftCarry = totalLeft - matchedBv;
    const newRightCarry = totalRight - matchedBv;

    const grossIncome = (matchedBv * incomePercentage) / 100;
    if (grossIncome <= 0) continue;

    const totalTds = (grossIncome * tds) / 100;
    const adminCharges = (grossIncome * admincharges) / 100;
    const netIncome = grossIncome - totalTds - adminCharges;

    totalIncome += grossIncome;
    totaltds += totalTds;
    totalAdmincharges += adminCharges;
    totalNetIncome += netIncome;

    await prisma.$transaction(async (tx) => {
      const incomeEntry = await tx.systemIncome.create({
        data: {
          user_id: userId,
          generateIncomeId: generateIncomeEntry.id,
          matched_bv: matchedBv,
          income: grossIncome,
          message_data: "Binary income generated",
          status: "ACTIVE",
        },
      });

      await tx.incomeHistory.create({
        data: {
          incomeId: generateIncomeEntry.id,
          userId,
          totalIncome: grossIncome,
          tds: totalTds,
          adminCharges,
        },
      });

      await tx.wallet.upsert({
        where: { user_id: userId },
        update: {
          total_left_bv: leftBV,
          total_right_bv: rightBV,
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
          matched_bv: { increment: matchedBv },
          total_income: { increment: grossIncome },
        },
        create: {
          user_id: userId,
          total_left_bv: leftBV,
          total_right_bv: rightBV,
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
          matched_bv: matchedBv,
          total_income: grossIncome,
        },
      });

      await tx.walletTransaction.create({
        data: {
          user_id: userId,
          type: "INCOME",
          amount: grossIncome,
          reference_id: incomeEntry.id,
          message: "Binary income created",
          status: "ACTIVE",
        },
      });

      // 5. Mark plan as processed
      await tx.planPurchase.updateMany({
        where: {
          user_id: userId,
          status: "APPROVED",
          is_income_generated: "NO",
        },
        data: { is_income_generated: "YES" },
      });
    });

    result.push({
      userId,
      matchedBv,
      grossIncome,
      netIncome,
    });
  }
  await prisma.generateIncome.update({
    where: { id: generateIncomeEntry.id },
    data: {
      totalIncome,
      netincome: totalNetIncome,
      tds: totaltds,
      adminCharges: totalAdmincharges,
    },
  });

  return result;
};

export const genincomeGenrepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.generateIncome.findMany({
      skip,
      take: limit,
      include: {
        royaltyIncomes: true,
        systemIncomes: true,
      },
      orderBy: { generatedDate: "desc" },
    }),
    prisma.generateIncome.count(),
  ]);

  const formattedData = data.map((batch) => {
    const totalRoyalty = batch.royaltyIncomes.reduce(
      (acc, curr) => acc + Number(curr.income),
      0,
    );
    const totalBinary = batch.systemIncomes.reduce(
      (acc, curr) => acc + Number(curr.income),
      0,
    );

    return {
      ...batch,
      totalRoyalty,
      totalBinary,
    };
  });

  return {
    data: formattedData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


export const getIncomeByBatchRepo = async (batchId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  // 1. Fetch system incomes (Binary) for this batch
  const systemIncomes = await prisma.systemIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true }
  });

  // 2. Fetch royalty incomes for this batch
  const royaltyIncomes = await prisma.royalClubIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true }
  });

  // 3. Fetch income history for deductions (TDS/Admin)
  const historyRecords = await prisma.incomeHistory.findMany({
    where: { incomeId: batchId }
  });

  const merged: Record<number, any> = {};

  // Process Binary
  for (const si of systemIncomes) {
    if (!merged[si.user_id]) {
      merged[si.user_id] = {
        userId: si.user_id,
        name: `${si.user.firstName} ${si.user.lastName}`.trim(),
        memId: si.user.memberId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }
    merged[si.user_id].binaryIncome += Number(si.income);
  }

  // Process Royalty
  for (const ri of royaltyIncomes) {
    if (!merged[ri.user_id]) {
      merged[ri.user_id] = {
        userId: ri.user_id,
        name: `${ri.user.firstName} ${ri.user.lastName}`.trim(),
        memId: ri.user.memberId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }
    merged[ri.user_id].royaltyIncome += Number(ri.income);
  }

  // Process Deductions from History
  for (const hr of historyRecords) {
    if (merged[hr.userId]) {
      merged[hr.userId].totalTds += Number(hr.tds);
      merged[hr.userId].totalAdminCharges += Number(hr.adminCharges);
    }
  }

  const finalData = Object.values(merged).map((user: any) => {
    const totalGross = user.binaryIncome + user.royaltyIncome;
    const netIncome = totalGross - user.totalTds - user.totalAdminCharges;

    return {
      ...user,
      binaryIncome: Number(user.binaryIncome.toFixed(2)),
      royaltyIncome: Number(user.royaltyIncome.toFixed(2)),
      tds: Number(user.totalTds.toFixed(2)),
      adminCharges: Number(user.totalAdminCharges.toFixed(2)),
      netIncome: Number(netIncome.toFixed(2)),
    };
  });

  const paginatedData = finalData.slice(skip, skip + limit);

  return {
    data: paginatedData,
    total: finalData.length,
    page,
    limit,
    totalPages: Math.ceil(finalData.length / limit),
  };
};

export const incomeHistoryRepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const rows = await prisma.incomeHistory.findMany();


  const merged: Record<number, any> = {};

  for (const row of rows) {
    if (!merged[row.userId]) {
      merged[row.userId] = {
        userId: row.userId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalTds: 0,
        totalAdminCharges: 0,
      };
    }

    const income = Number(row.totalIncome ?? 0);
    const tds = Number(row.tds ?? 0);
    const admin = Number(row.adminCharges ?? 0);



    merged[row.userId].totalTds += tds;
    merged[row.userId].totalAdminCharges += admin;


    if (row.incomeId === 1 || row.incomeId === 2) {

      merged[row.userId].binaryIncome += income;
    }
    else if (row.incomeId === 3) {
      merged[row.userId].royaltyIncome += income;
    }
  }




  const userIds = Object.keys(merged).map(Number);

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      memberId: true,
    },
  });

  const userMap: Record<number, any> = {};
  users.forEach((u) => {
    userMap[u.id] = u;
  });


  const finalData = Object.values(merged).map((user: any) => {
    const totalIncome = user.binaryIncome + user.royaltyIncome;
    const netIncome =
      totalIncome - user.totalTds - user.totalAdminCharges;

    const result = {
      userId: user.userId,
      name: `${userMap[user.userId]?.firstName ?? ""} ${userMap[user.userId]?.lastName ?? ""
        }`.trim(),
      memId: userMap[user.userId]?.memberId || null,

      binaryIncome: Number(user.binaryIncome.toFixed(2)),
      royaltyIncome: Number(user.royaltyIncome.toFixed(2)),

      tds: Number(user.totalTds.toFixed(2)),
      adminCharges: Number(user.totalAdminCharges.toFixed(2)),

      netIncome: Number(netIncome.toFixed(2)),
    };



    return result;
  });
  const paginatedData = finalData.slice(skip, skip + limit);

  return {
    skip,
    page,
    limit,
    data: paginatedData,
    total: finalData.length,
    totalpage: Math.ceil(finalData.length / limit),
  };
};