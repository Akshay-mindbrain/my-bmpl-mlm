import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthRepository from "../data/repositories/AuthRepository";
import config from "../config";
import AuthenticationError from "../errors/AuthenticationError";
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
                //throw new 409({message: "username already exists"})
                throw new CustomError({
                    message: "Username already exists. Please choose another one.",
                    statusCode: 409,
                    code: "ERR_CONFLICT",
                });
            }

            // Check for existing email if provided
            if (data.email) {
                const existingEmail = await this.authRepository.getAdminByEmail(data.email);
                if (existingEmail) {
                    throw new CustomError({
                        message: "An account with this email already exists.",
                        statusCode: 409,
                        code: "ERR_CONFLICT",
                    });
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
                throw new CustomError({
                    message: "Invalid admin type provided. Please use SUPERADMIN, ADMIN, or MANAGER.",
                    statusCode: 400,
                    code: "ERR_VALID",
                });
            }

            throw new CustomError({
                message: "We encountered an error while creating your account. Please try again later.",
                statusCode: 500,
                code: "ERR_SERVER",
            });
        }
    }

    async login(username: string, password: string, ipAddress?: string, userAgent?: string) {
        try {
            const admin = await this.authRepository.getAdminByUsername(username);
            if (!admin) {
                throw new AuthenticationError({
                    message: "Invalid username or password.",
                    statusCode: 401,
                    code: "ERR_AUTH",
                });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                throw new AuthenticationError({
                    message: "Invalid username or password.",
                    statusCode: 401,
                    code: "ERR_AUTH",
                });
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
            throw new CustomError({
                message: "An error occurred during login. Please try again later.",
                statusCode: 500,
                code: "ERR_SERVER",
            });
        }
    }

    private generateAccessToken(id: number, username: string): string {
        try {
            return jwt.sign({ id, username }, config.jwtAccessSecret, { expiresIn: "15m" });
        } catch (error) {
            throw new CustomError({
                message: "Failed to generate security token.",
                statusCode: 500,
                code: "ERR_SERVER",
            });
        }
    }

    private generateRefreshToken(id: number): string {
        try {
            return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
        } catch (error) {
            throw new CustomError({
                message: "Failed to generate security token.",
                statusCode: 500,
                code: "ERR_SERVER",
            });
        }
    }

    async logout(adminId: number, loginHistoryId: number) {
        try {
            await this.authRepository.updateAdminTokens(adminId, "", "");
            await this.authRepository.updateLogoutTime(loginHistoryId);
        } catch (error) {
            throw new CustomError({
                message: "An error occurred while logging out.",
                statusCode: 500,
                code: "ERR_SERVER",
            });
        }
    }
}
