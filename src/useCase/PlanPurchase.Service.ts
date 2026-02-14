import { Prisma, PlanPurchase  } from "@prisma/client";
import * as planPurchaseRepo from "../data/repositories/PlanPurchase.Repository";
import * as planRepo from "../data/repositories/Package.Repository";
import * as userRepo from "../data/repositories/Users.Repository";
import * as adminRepo from "../data/repositories/AuthRepository";
import AppError from "@/errors/AppError";

export const createPlanPurchase = async (data: any): Promise<PlanPurchase> => {

  if (!data?.plan) throw AppError.badRequest("plan id is required");
  if (!data?.user) throw AppError.badRequest("user id is required");

  if (!data?.BV || !data?.dp_amount || !data?.plan_amount)
    throw AppError.badRequest("Financial fields missing");

  const plan = await planRepo.getPackageById(data.plan);
  if (!plan) throw AppError.notFound("Plan not found");

  const user = await userRepo.getUserById(data.user);
  if (!user) throw AppError.notFound("User not found");

  const admin = await adminRepo.getAdmin();
  if (!admin) throw AppError.notFound("Admin not found");

  const adminName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
  const prismaInput: Prisma.PlanPurchaseCreateInput = {
    BV: data.BV,
    dp_amount: data.dp_amount,
    plan_amount: data.plan_amount,
    payment_mode: data.payment_mode,
    payment_proof_uri: data.payment_proof_uri,
    is_income_generated: data.is_income_generated,
    purchase_type: data.purchase_type,

    createdBy: adminName,
    updatedBy: adminName,
    plan: {
      connect: { id: data.plan },
    },

    user: {
      connect: { id: data.user },
    },
  };

  return planPurchaseRepo.create(prismaInput);
};

export const getAllPlanPurchases = async () => {
  return planPurchaseRepo.getAll();
};

export const getPlanPurchaseById = async (id: number) => {
  const purchase = await planPurchaseRepo.findById(id);

  if (!purchase) {
    throw new Error("Plan purchase not found");
  }

  return purchase;
};

export const getPurchasesByUser = async (userId: number) => {
  return planPurchaseRepo.findByUserId(userId);
};

export const getPurchasesByPlan = async (planId: string) => {
  return planPurchaseRepo.findByPlanId(planId);
};

export const getPendingApprovals = async () => {
  return planPurchaseRepo.getPendingApprovals();
};

export const approvePurchase = async (purchaseId: number, adminId: number) => {
  const purchase = await planPurchaseRepo.findById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  if (purchase.approved_by) {
    throw new Error("Purchase already approved");
  }

  return planPurchaseRepo.approvePurchase(purchaseId, adminId);
};

export const markIncomeGenerated = async (purchaseId: number) => {
  const purchase = await planPurchaseRepo.findById(purchaseId);

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  return planPurchaseRepo.markIncomeGenerated(purchaseId);
};
