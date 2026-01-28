import bcrypt from "bcryptjs";
import UserRepository from "../data/repositories/UserRepository";
import AppError from "../errors/AppError";

export default class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: any, adminId: number, adminUsername: string) {
        // Check for existing username
        const existingUsername = await this.userRepository.getUserByUsername(data.username);
        if (existingUsername) {
            throw AppError.conflict("Username already exists.");
        }

        // Check for existing email
        const existingEmail = await this.userRepository.getUserByEmail(data.email);
        if (existingEmail) {
            throw AppError.conflict("Email already exists.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
            createdBy: adminUsername,
            admin: { connect: { id: adminId } }
        }, adminId);
    }

    async getUsers(adminId: number) {
        return await this.userRepository.listUsersByAdmin(adminId);
    }

    async getUser(id: number, adminId: number) {
        const user = await this.userRepository.getUserById(id);
        if (!user || user.adminId !== adminId) {
            throw AppError.notFound("User not found or you don't have access.");
        }
        return user;
    }

    async updateUser(id: number, data: any, adminId: number, adminUsername: string) {
        await this.getUser(id, adminId);

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await this.userRepository.updateUser(id, {
            ...data,
            updatedBy: adminUsername
        }, adminId);
    }

    async deleteUser(id: number, adminId: number) {
        await this.getUser(id, adminId);
        return await this.userRepository.deleteUser(id, adminId);
    }
}
