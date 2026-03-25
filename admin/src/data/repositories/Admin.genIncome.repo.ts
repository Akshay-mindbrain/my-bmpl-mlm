import prisma from "@/prisma-client";
import {
  elegibleForincome,
  getIncomePercentage,
  getRoyalityPercentage,
  getTDS,
  getWalletCarryBV,
} from "@/utils/incomeHelper";
import { getUserTotalBVRepo } from "./Admin.totalbv.repo";

export const getIncomeGenarateRepo = async () => {
  console.log("Starting Bulk Income Generation...");
  
  // ── 0. Initializations & Configurations ───────────────────────────────
  const eligibleUsers = await elegibleForincome();
  
  // DEBUG LINE for User 1
  const user1 = await prisma.user.findUnique({ where: { id: 1 }, include: { planPurchases: { where: { status: "APPROVED" } } } });
  const user1Ledger = await prisma.bVLedger.findFirst({ where: { user_id: 1, is_income_generated: "NO" } });
  console.log("DEBUG: User 1 - Found:", !!user1, "Approved Plans:", user1?.planPurchases.length, "Pending BV:", !!user1Ledger);
  console.log("Eligible Users list:", eligibleUsers.map(u => u.user_id));
  const incomePercentage = await getIncomePercentage();
  const royaltyPercentage = await getRoyalityPercentage();
  const { tds, admincharges } = await getTDS();

  const config = await prisma.config.findFirst();
  const royalQualifierPlans = config 
    ? await prisma.configRoyalPlan.findMany({ where: { id: config.id } })
    : [];

  const generateIncomeEntry = await prisma.generateIncome.create({
    data: {
      totalIncome: 0,
      netincome: 0,
      tds: 0,
      adminCharges: 0,
      generatedDate: new Date(),
    },
  });

  let totalGrandGross = 0;
  let totalGrandTds = 0;
  let totalGrandAdmin = 0;
  let totalGrandNet = 0;

  // Track results per user for the response
  const userResults = new Map<number, any>();

  const getOrCreateUserResult = (userId: number) => {
    if (!userResults.has(userId)) {
      userResults.set(userId, {
        userId,
        binaryIncome: 0,
        royaltyIncome: 0,
        totalGross: 0,
        totalNet: 0,
        matchedBv: 0
      });
    }
    return userResults.get(userId);
  };

  // ── 1. Royalty Income Processing ──────────────────────────────────────
  console.log("Processing Royalty Income...");
  const pendingRoyaltyPurchases = await prisma.planPurchase.findMany({
    where: {
      status: "APPROVED",
      is_income_generated: "NO",
    },
    include: {
      user: true,
      plan: true,
    },
  });

  for (const purchase of pendingRoyaltyPurchases) {
    const markAsProcessed = async () => {
      await prisma.planPurchase.update({
        where: { id: purchase.id },
        data: { is_income_generated: "YES" },
      });
    };

    if (!purchase.user.sponsorId) {
      await markAsProcessed();
      continue;
    }

    const isQualifierPlan = royalQualifierPlans.some(p => p.planid === purchase.plan_id);
    if (!isQualifierPlan) {
      await markAsProcessed();
      continue;
    }

    const sponsorDirects = await prisma.user.findUnique({
      where: { id: purchase.user.sponsorId },
      include: {
        sponsoredUsers: {
          where: {
            planPurchases: { some: { status: "APPROVED" } }
          },
          orderBy: { createdAt: 'asc' },
          select: { id: true }
        }
      }
    });

    if (!sponsorDirects) {
      await markAsProcessed();
      continue;
    }

    const buyerIndex = sponsorDirects.sponsoredUsers.findIndex(u => u.id === purchase.user_id);
    if (buyerIndex < 2) {
      await markAsProcessed();
      continue; // Only 3rd+ referral gets royalty
    }

    const grossRoyalty = (Number(purchase.plan_amount) * royaltyPercentage) / 100;
    if (grossRoyalty <= 0) {
      await markAsProcessed();
      continue;
    }

    const rTds = (grossRoyalty * tds) / 100;
    const rAdmin = (grossRoyalty * admincharges) / 100;
    const rNet = grossRoyalty - rTds - rAdmin;

    totalGrandGross += grossRoyalty;
    totalGrandTds += rTds;
    totalGrandAdmin += rAdmin;
    totalGrandNet += rNet;

    await prisma.$transaction(async (tx) => {
      const royaltyEntry = await tx.royalClubIncome.create({
        data: {
          user_id: purchase.user.sponsorId!,
          generateIncomeId: generateIncomeEntry.id,
          income: grossRoyalty,
          message_data: `Royalty Income from ${purchase.user.firstName} ${purchase.user.lastName} (Plan: ${purchase.plan.planName})`,
          status: "ACTIVE",
        },
      });

      await tx.incomeHistory.create({
        data: {
          incomeId: generateIncomeEntry.id,
          userId: purchase.user.sponsorId!,
          totalIncome: grossRoyalty,
          tds: rTds,
          adminCharges: rAdmin,
        },
      });

      await tx.wallet.upsert({
        where: { user_id: purchase.user.sponsorId! },
        update: {
          total_income: { increment: rNet },
        },
        create: {
          user_id: purchase.user.sponsorId!,
          total_income: rNet,
          matched_bv: 0,
          total_left_bv: 0,
          total_right_bv: 0,
        },
      });

      await tx.walletTransaction.create({
        data: {
          user_id: purchase.user.sponsorId!,
          type: "INCOME",
          amount: rNet,
          reference_id: royaltyEntry.id,
          message: `Royalty income from referral ${purchase.user.memberId}`,
          status: "ACTIVE",
        },
      });

      await tx.planPurchase.update({
        where: { id: purchase.id },
        data: { is_income_generated: "YES" },
      });
    });

    // Update result for response
    const res = getOrCreateUserResult(purchase.user.sponsorId!);
    res.royaltyIncome += grossRoyalty;
    res.totalGross += grossRoyalty;
    res.totalNet += rNet;
  }

  // ── 2. Binary Matching Income Processing ───────────────────────────────
  console.log("Processing Binary Matching Income...");
  for (const u of eligibleUsers) {
    const userId = u.user_id;
    const { leftBV, rightBV } = await getUserTotalBVRepo(userId);
    const { leftCarry, rightCarry } = await getWalletCarryBV(userId);

    const totalLeft = leftBV + leftCarry;
    const totalRight = rightBV + rightCarry;
    
    // Floor matchedBv to ensure it's an integer for the DB
    const matchedBvRaw = Math.min(totalLeft, totalRight);
    const matchedBv = Math.floor(matchedBvRaw);
    
    if (matchedBv <= 0) {
      if (leftBV > 0 || rightBV > 0) {
        await prisma.$transaction(async (tx) => {
          await tx.wallet.upsert({
            where: { user_id: userId },
            update: {
              total_left_bv: { increment: leftBV },
              total_right_bv: { increment: rightBV },
              left_carryforward_bv: totalLeft,
              right_carryforward_bv: totalRight,
            },
            create: {
              user_id: userId,
              total_income: 0,
              matched_bv: 0,
              total_left_bv: leftBV,
              total_right_bv: rightBV,
              left_carryforward_bv: totalLeft,
              right_carryforward_bv: totalRight,
            },
          });

          await tx.bVLedger.updateMany({
             where: { user_id: userId, is_income_generated: "NO" },
             data: { is_income_generated: "YES" }
          });
        });
      }
      continue;
    }

    const newLeftCarry = totalLeft - matchedBv;
    const newRightCarry = totalRight - matchedBv;
    const grossIncome = (matchedBv * incomePercentage) / 100;
    
    if (grossIncome <= 0) continue;

    const bTds = (grossIncome * tds) / 100;
    const bAdmin = (grossIncome * admincharges) / 100;
    const bNet = grossIncome - bTds - bAdmin;

    totalGrandGross += grossIncome;
    totalGrandTds += bTds;
    totalGrandAdmin += bAdmin;
    totalGrandNet += bNet;

    await prisma.$transaction(async (tx) => {
      const incomeEntry = await tx.systemIncome.create({
        data: {
          user_id: userId,
          generateIncomeId: generateIncomeEntry.id,
          matched_bv: matchedBv,
          income: grossIncome,
          message_data: `Binary match: ${matchedBv} BV`,
          status: "ACTIVE",
        },
      });

      await tx.incomeHistory.create({
        data: {
          incomeId: generateIncomeEntry.id,
          userId,
          totalIncome: grossIncome,
          tds: bTds,
          adminCharges: bAdmin,
        },
      });

      await tx.wallet.upsert({
        where: { user_id: userId },
        update: {
          total_left_bv: { increment: leftBV },
          total_right_bv: { increment: rightBV },
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
          matched_bv: { increment: matchedBv },
          total_income: { increment: bNet },
        },
        create: {
          user_id: userId,
          total_left_bv: leftBV,
          total_right_bv: rightBV,
          left_carryforward_bv: newLeftCarry,
          right_carryforward_bv: newRightCarry,
          matched_bv: matchedBv,
          total_income: bNet,
        },
      });

      await tx.walletTransaction.create({
        data: {
          user_id: userId,
          type: "INCOME",
          amount: bNet,
          reference_id: incomeEntry.id,
          message: `Binary matching income: ${matchedBv} BV matched`,
          status: "ACTIVE",
        },
      });

      await tx.bVLedger.updateMany({
        where: { user_id: userId, is_income_generated: "NO" },
        data: { is_income_generated: "YES" },
      });

      await tx.planPurchase.updateMany({
        where: { user_id: userId, status: "APPROVED", is_income_generated: "NO" },
        data: { is_income_generated: "YES" },
      });
    });

    const res = getOrCreateUserResult(userId);
    res.binaryIncome += grossIncome;
    res.matchedBv += matchedBv;
    res.totalGross += grossIncome;
    res.totalNet += bNet;
  }

  // ── 3. Final Updates ──────────────────────────────────────────────────
  await prisma.generateIncome.update({
    where: { id: generateIncomeEntry.id },
    data: {
      totalIncome: totalGrandGross,
      netincome: totalGrandNet,
      tds: totalGrandTds,
      adminCharges: totalGrandAdmin,
    },
  });

  console.log("Income Generation Completed Successfully.");
  return Array.from(userResults.values());
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
    const totalRoyalty = batch.royaltyIncomes.reduce((acc, curr) => acc + Number(curr.income), 0);
    const totalBinary = batch.systemIncomes.reduce((acc, curr) => acc + Number(curr.income), 0);
    return { ...batch, totalRoyalty, totalBinary };
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

  const systemIncomes = await prisma.systemIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true }
  });

  const royaltyIncomes = await prisma.royalClubIncome.findMany({
    where: { generateIncomeId: batchId },
    include: { user: true }
  });

  const historyRecords = await prisma.incomeHistory.findMany({
    where: { incomeId: batchId }
  });

  const merged: Record<number, any> = {};

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
    } else if (row.incomeId === 3) {
      merged[row.userId].royaltyIncome += income;
    }
  }

  const userIds = Object.keys(merged).map(Number);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, memberId: true },
  });

  const userMap: Record<number, any> = {};
  users.forEach((u) => { userMap[u.id] = u; });

  const finalData = Object.values(merged).map((user: any) => {
    const totalInc = user.binaryIncome + user.royaltyIncome;
    const netInc = totalInc - user.totalTds - user.totalAdminCharges;

    return {
      userId: user.userId,
      name: `${userMap[user.userId]?.firstName ?? ""} ${userMap[user.userId]?.lastName ?? ""}`.trim(),
      memId: userMap[user.userId]?.memberId || null,
      binaryIncome: Number(user.binaryIncome.toFixed(2)),
      royaltyIncome: Number(user.royaltyIncome.toFixed(2)),
      tds: Number(user.totalTds.toFixed(2)),
      adminCharges: Number(user.totalAdminCharges.toFixed(2)),
      netIncome: Number(netInc.toFixed(2)),
    };
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