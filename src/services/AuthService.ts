import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthRepository from "../data/repositories/AuthRepository";
import config from "../config";
import AppError from "../errors/AppError";
import CustomError from "../errors/CustomError";

export default class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    async signup(data: any) {
        try {
            // Check for existing username
            const existingUsername = await this.authRepository.getAdminByUsername(data.username);
            if (existingUsername) {
                throw AppError.conflict("Username already exists. Please choose another one.");
            }

            // Check for existing email if provided
            if (data.email) {
                const existingEmail = await this.authRepository.getAdminByEmail(data.email);
                if (existingEmail) {
                    throw AppError.conflict("An account with this email already exists.");
                }
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const adminData = {
                ...data,
                password: hashedPassword,
            };

            return await this.authRepository.createAdmin(adminData);
        } catch (error) {
            if (error instanceof CustomError) throw error;

            // Handle specific Prisma errors if they bubble up
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes("admin_type") && errorMessage.includes("Data truncated")) {
                throw AppError.badRequest("Invalid admin type provided. Please use SUPERADMIN, ADMIN, or MANAGER.");
            }

            throw AppError.internal("We encountered an error while creating your account. Please try again later.");
        }
    }

    async login(username: string, password: string, ipAddress?: string, userAgent?: string) {
        try {
            const admin = await this.authRepository.getAdminByUsername(username);
            if (!admin) {
                throw AppError.unauthorized("Invalid username or password.");
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                throw AppError.unauthorized("Invalid username or password.");
            }

            const accessToken = this.generateAccessToken(admin.id, admin.username);
            const refreshToken = this.generateRefreshToken(admin.id);

            // Update tokens and login history
            await this.authRepository.updateAdminTokens(admin.id, accessToken, refreshToken);
            await this.authRepository.createLoginHistory({
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
    }

    private generateAccessToken(id: number, username: string): string {
        try {
            return jwt.sign({ id, username }, config.jwtAccessSecret, { expiresIn: "15m" });
        } catch (error) {
            throw AppError.internal("Failed to generate security token.");
        }
    }

    private generateRefreshToken(id: number): string {
        try {
            return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
        } catch (error) {
            throw AppError.internal("Failed to generate security token.");
        }
    }
}
