import BaseRepository from "./BaseRepository";
import { User, Prisma } from "@prisma/client";

export default class UserRepository extends BaseRepository {
    async createUser(data: Prisma.UserCreateInput, adminId: number): Promise<User> {
        return this.client.$transaction(async (tx) => {
            const user = await tx.user.create({ data });
            await tx.userActivityLog.create({
                data: {
                    userId: user.id,
                    adminId: adminId,
                    action: "CREATE",
                    details: `Created user ${user.username}`
                }
            });
            return user;
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return this.client.user.findUnique({
            where: { id },
        });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.client.user.findUnique({
            where: { username },
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.client.user.findUnique({
            where: { email },
        });
    }

    async listUsersByAdmin(adminId: number): Promise<User[]> {
        return this.client.user.findMany({
            where: { adminId },
            orderBy: { createdAt: "desc" },
        });
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput, adminId: number): Promise<User> {
        return this.client.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id },
                data,
            });
            await tx.userActivityLog.create({
                data: {
                    userId: user.id,
                    adminId: adminId,
                    action: "UPDATE",
                    details: `Updated user ${user.username} fields`
                }
            });
            return user;
        });
    }

    async deleteUser(id: number, adminId: number): Promise<User> {
        return this.client.$transaction(async (tx) => {
            const user = await tx.user.delete({
                where: { id },
            });
            await tx.userActivityLog.create({
                data: {
                    userId: null,
                    adminId: adminId,
                    action: "DELETE",
                    details: `Deleted user ${user.username} (ID: ${id})`
                }
            });
            return user;
        });
    }
}
