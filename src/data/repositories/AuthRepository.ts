import prisma from "../../prisma-client";
import { Admin, AdminLoginHistory } from "@prisma/client";

export const getAdminByUsername = async (username: string): Promise<Admin | null> => {
    return prisma.admin.findUnique({
        where: { username },
    });
};

export const getAdminByEmail = async (email: string): Promise<Admin | null> => {
    return prisma.admin.findUnique({
        where: { email },
    });
};

export const createAdmin = async (data: any): Promise<Admin> => {
    return prisma.admin.create({
        data,
    });
};

export const updateAdminTokens = async (adminId: number, accessToken: string, refreshToken: string): Promise<Admin> => {
    return prisma.admin.update({
        where: { id: adminId },
        data: { accessToken, refreshToken },
    });
};

export const createLoginHistory = async (data: { adminId: number; ipAddress?: string; userAgent?: string }): Promise<AdminLoginHistory> => {
    return prisma.adminLoginHistory.create({
        data,
    });
};

export const updateLogoutTime = async (historyId: number): Promise<AdminLoginHistory> => {
    return prisma.adminLoginHistory.update({
        where: { id: historyId },
        data: { logoutTime: new Date() },
    });
};

export const getLatestLoginHistory = async (adminId: number): Promise<AdminLoginHistory | null> => {
    return prisma.adminLoginHistory.findFirst({
        where: { adminId, logoutTime: null },
        orderBy: { loginTime: "desc" },
    });
};
