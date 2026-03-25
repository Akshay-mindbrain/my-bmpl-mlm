import { USER_BASE_URL } from "../config/api.config";

export const getPendingPlanPurchasesApi = async () => {
  const res = await fetch(`${USER_BASE_URL}/v1/planpurchase/details/pending`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Failed to fetch pending purchases");
  }

  return json;
};

export const approvePlanPurchaseApi = async (id: number) => {
  const res = await fetch(`${USER_BASE_URL}/v1/planpurchase/approve/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Failed to approve purchase");
  }

  return json;
};
