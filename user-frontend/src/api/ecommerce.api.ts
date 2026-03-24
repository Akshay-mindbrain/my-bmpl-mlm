import { BASE_URL } from "../config/api.config";

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// --- Products ---
export const getProductsApi = async (params?: any) => {
  const query = params ? new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BASE_URL}/v1/products?${query}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const getProductDetailsApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/v1/products/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const getCategoriesApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/products/categories`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

// --- Cart ---
export const getCartApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/cart`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const addToCartApi = async (productId: number, quantity: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/add`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
};

export const updateCartItemApi = async (productId: number, quantity: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/update`, {
    method: "PUT",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
};

export const removeFromCartApi = async (productId: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/remove/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

// --- Address ---
export const getAddressesApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/address`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const addAddressApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/address`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

// --- Orders ---
export const placeOrderApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/order`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMyOrdersApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/order`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const getOrderDetailsApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/v1/order/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

// --- Reviews ---
export const addReviewApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/products/review`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMyPayoutsApi = async (page: number, limit: number) => {
  const res = await fetch(`${BASE_URL}/v1/payout?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};
