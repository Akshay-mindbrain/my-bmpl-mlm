import AppError from "@/errors/AppError";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
} from "../../data/repositories/Order.Repository";
import {
  getUserWallet,
  updateWalletBalance,
} from "../../data/repositories/wallet.Repository";

import { Prisma, OrderPlace } from "@prisma/client";
import prisma from "@/prisma-client";

export const createOrderService = async (data: any): Promise<OrderPlace> => {
  if (!data.customerId) {
    throw AppError.badRequest("Customer id is required");
  }

  if (!data.items || data.items.length === 0) {
    throw AppError.badRequest("Order items are required");
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await getUserWallet(data.customerId, tx);

    if (!wallet) {
      throw AppError.badRequest("Wallet not found");
    }

    const productIds = data.items.map((i: any) => i.productId);

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== data.items.length) {
      throw AppError.badRequest("Some products not found");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    let totalDp = 0;
    let totalBv = 0;
    let totalTax = 0;
    const orderItems = data.items.map((item: any) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw AppError.badRequest(`Product not found: ${item.productId}`);
      }

      const price = Number(product.mrp_amount);
      const dp = Number(product.dp_amount);
      const quantity = item.quantity;

      const itemSubtotal = price * quantity;
      const itemDp = dp * quantity;

      const itemTax = 0;

      subtotal += itemSubtotal;
      totalDp += itemDp;

      const bv = Math.floor(itemSubtotal / 10);
      totalBv += bv;

      return {
        productId: product.id,
        productName: product.productName,
        sku: product.sku,
        price: price,
        // dpAmount: dp,
        quantity: quantity,
        bv: bv,
        totalPrice: itemSubtotal,
      };
    });

    let shippingAmount = subtotal >= 5000 ? 0 : 100;

    const totalPurchaseAmount = subtotal + shippingAmount;

    if (totalPurchaseAmount < 500) {
      throw AppError.badRequest("Minimum order value is ₹500");
    }

    const walletDp = Number(wallet.balance_dp_amount);

    if (walletDp < totalDp) {
      throw AppError.badRequest("Insufficient wallet DP balance");
    }

    const order = await tx.orderPlace.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date(),

        customerId: data.customerId,
        paymentMethod: data.paymentMethod,

        subtotal,
        shippingAmount,
        gstAmount: 0,
        coinsApplied: 0,

        totalPurchaseAmount,
        totalDpAmount: totalDp,
        totalTax: 0,
        totalBv,

        items: {
          create: orderItems,
        },

        address: data.address
          ? {
              create: data.address,
            }
          : undefined,
      },
    });

    await updateWalletBalance(data.customerId, totalDp, tx);

    // 6. Clear user cart
    await tx.cart.deleteMany({
      where: { userId: data.customerId }
    });

    return order;
  });
};

export const getAllOrdersService = async (): Promise<OrderPlace[]> => {
  return getAllOrders();
};

export const getOrderByIdService = async (id: number): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const order = await getOrderById(id);

  if (!order) {
    throw AppError.notFound("Order not found");
  }

  return order;
};

export const getOrdersByCustomerService = async (
  customerId: number,
): Promise<OrderPlace[]> => {
  if (!customerId) {
    throw AppError.badRequest("Customer id is required");
  }

  return getOrdersByCustomer(customerId);
};

export const updateOrderService = async (
  id: number,
  data: Prisma.OrderPlaceUpdateInput,
): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw AppError.notFound("Order not found");
  }

  return updateOrder(id, data);
};

export const deleteOrderService = async (id: number): Promise<OrderPlace> => {
  if (!id) {
    throw AppError.badRequest("Order id is required");
  }

  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw AppError.notFound("Order not found");
  }

  return deleteOrder(id);
};
