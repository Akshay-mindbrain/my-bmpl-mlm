import { Prisma, PurchaseType } from "@prisma/client";
import prisma from "@/prisma-client";
import AppError from "@/errors/AppError";
import { createBVLedgerForLineageRaw } from "@/data/repositories/BVledger.Repository";
import { processRoyaltyIncome } from "../system_income/royaltyIncome.useCase";
import { processMatchingIncomeForUplines } from "../system_income/processMatchingIncome.useCase";

export const approvePlanPurchase = async (
  purchaseId: number,
  adminId?: number,
  tx?: Prisma.TransactionClient,
) => {
  if (tx) {
    // 🔹 Already inside transaction
    const purchase = await tx.planPurchase.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) throw AppError.notFound("Purchase not found");

    if (purchase.status === "APPROVED")
      throw AppError.badRequest("Purchase already approved");

    const updatedPurchase = await tx.planPurchase.update({
      where: { id: purchaseId },
      data: {
        status: "APPROVED",
        approved_at: new Date(),
        approve_status: "MANUALADMIN",
        approved_by: adminId,
      },
    });

    if (purchase.purchase_type !== PurchaseType.SHARE_PURCHASE) {
      await createBVLedgerForLineageRaw(
        {
          purchase_id: purchase.id,
          buyer_id: purchase.user_id,
          bv: purchase.BV,
          purchase_type: purchase.purchase_type,
          is_income_generated: "NO",
        },
        tx,
      );

      // Process binary matching income for all uplines (non-blocking)
      try {
        await processMatchingIncomeForUplines(purchase.user_id, tx);
      } catch (e) {
        console.error("[Income] Binary matching income failed:", e);
      }
    }

    // Process royalty income (non-blocking)
    try {
      await processRoyaltyIncome(purchaseId, tx);
    } catch (e) {
      console.error("[Income] Royalty income failed:", e);
    }

    return updatedPurchase;
  }

  // 🔹 Not inside transaction → create one
  return prisma.$transaction(async (trx) => {
    const purchase = await trx.planPurchase.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) throw AppError.notFound("Purchase not found");

    if (purchase.status === "APPROVED")
      throw AppError.badRequest("Purchase already approved");

    const updatedPurchase = await trx.planPurchase.update({
      where: { id: purchaseId },
      data: {
        status: "APPROVED",
        approved_at: new Date(),
        approve_status: "MANUALADMIN",
        approved_by: adminId,
      },
    });

    if (purchase.purchase_type !== PurchaseType.SHARE_PURCHASE) {
      await createBVLedgerForLineageRaw(
        {
          purchase_id: purchase.id,
          buyer_id: purchase.user_id,
          bv: purchase.BV,
          purchase_type: purchase.purchase_type,
          is_income_generated: "NO",
        },
        trx,
      );

      // Process binary matching income for all uplines (non-blocking)
      try {
        await processMatchingIncomeForUplines(purchase.user_id, trx);
      } catch (e) {
        console.error("[Income] Binary matching income failed:", e);
      }
    }

    // Process royalty income (non-blocking)
    try {
      await processRoyaltyIncome(purchaseId, trx);
    } catch (e) {
      console.error("[Income] Royalty income failed:", e);
    }

    return updatedPurchase;
  });
};
