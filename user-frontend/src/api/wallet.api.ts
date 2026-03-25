import { BASE_URL } from "../config/api.config";

export const getWallet = async () => {
  try {
    let res = await fetch(`${BASE_URL}/v1/wallet/get`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) {
      throw new Error("Session expired...");
    }

    if (res.status === 401) {
      try {
        res = await fetch(`${BASE_URL}/v1/wallet/get`, {
          method: "GET",
          credentials: "include",
        });
      } catch (err) {
        window.location.href = "/login";
        throw new Error("Session Expired");
      }
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Wallet fetch failed...");
    }

    return data;
  } catch (err) {
    console.log("wallet fetch failed...");
    throw err;
  }
};