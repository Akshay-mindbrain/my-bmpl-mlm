import BaseRepository from "./BaseRepository";
import { Admin, AdminLoginHistory } from "@prisma/client";

export default class AuthRepository extends BaseRepository {
    async getAdminByUsername(username: string): Promise<Admin | null> {
        return this.client.admin.findUnique({
            where: { username },
        });
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        return this.client.admin.findUnique({
            where: { email },
        });
    }

    async createAdmin(data: any): Promise<Admin> {
        return this.client.admin.create({
            data,
        });
    }

    async updateAdminTokens(adminId: number, accessToken: string, refreshToken: string): Promise<Admin> {
        return this.client.admin.update({
            where: { id: adminId },
            data: { accessToken, refreshToken },
        });
    }

    async createLoginHistory(data: { adminId: number; ipAddress?: string; userAgent?: string }): Promise<AdminLoginHistory> {
        return this.client.adminLoginHistory.create({
            data,
        });
    }

    async updateLogoutTime(historyId: number): Promise<AdminLoginHistory> {
        return this.client.adminLoginHistory.update({
            where: { id: historyId },
            data: { logoutTime: new Date() },
        });
    }
}
