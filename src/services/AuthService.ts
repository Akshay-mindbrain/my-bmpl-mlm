import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import * as authRepository from "../data/repositories/AuthRepository";
import AppError from "../errors/AppError";
import CustomError from "../errors/CustomError";

const generateAccessToken = (id: number, username: string): string => {
    try {
        return jwt.sign({ id, username }, config.jwtAccessSecret, { expiresIn: "15m" });
    } catch (error) {
        throw AppError.internal("Failed to generate security token.");
    }
};

const generateRefreshToken = (id: number): string => {
    try {
        return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
    } catch (error) {
        throw AppError.internal("Failed to generate security token.");
    }
};

export const signup = async (data: any) => {
    try {
        const existingUser = await authRepository.getAdminByUsername(data.username);
        if (existingUser) {
            throw AppError.badRequest("Username already exists. Please choose another one.");
        }

        const existingEmail = await authRepository.getAdminByEmail(data.email);
        if (existingEmail) {
            throw AppError.badRequest("An account with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const adminData = {
            ...data,
            password: hashedPassword,
        };

        return await authRepository.createAdmin(adminData);
    } catch (error) {
        if (error instanceof CustomError) throw error;

        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("admin_type") && errorMessage.includes("Data truncated")) {
            throw AppError.badRequest("Invalid admin type provided. Please use SUPERADMIN, ADMIN, or MANAGER.");
        }

        throw AppError.internal("We encountered an error while creating your account. Please try again later.");
    }
};

export const login = async (username: string, password: string, ipAddress?: string, userAgent?: string) => {
    try {
        const admin = await authRepository.getAdminByUsername(username);
        if (!admin) {
            throw AppError.unauthorized("Invalid username or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw AppError.unauthorized("Invalid username or password.");
        }

        const accessToken = generateAccessToken(admin.id, admin.username);
        const refreshToken = generateRefreshToken(admin.id);

        // Update tokens and login history
        await authRepository.updateAdminTokens(admin.id, accessToken, refreshToken);
        await authRepository.createLoginHistory({
            adminId: admin.id,
            ipAddress,
            userAgent,
        });

        return {
            admin: {
                id: admin.id,
                username: admin.username,
                firstName: admin.firstName,
                lastName: admin.lastName,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw AppError.internal("An error occurred during login. Please try again later.");
    }
};

export const logout = async (adminId: number) => {
    try {
        const latestHistory = await authRepository.getLatestLoginHistory(adminId);
        if (latestHistory) {
            await authRepository.updateLogoutTime(latestHistory.id);
        }
        await authRepository.updateAdminTokens(adminId, "", "");
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw AppError.internal("An error occurred during logout.");
    }
};
