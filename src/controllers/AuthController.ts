import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import AuthRepository from "../data/repositories/AuthRepository";
import { AuthRequest } from "../middleware/authenticate-user";
import AppError from "../errors/AppError";

export default class AuthController {
    private authService: AuthService;
    private authRepository: AuthRepository;

    constructor() {
        this.authService = new AuthService();
        this.authRepository = new AuthRepository();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const admin = await this.authService.signup(req.body);
            res.status(201).json({
                message: "Admin created successfully",
                data: {
                    id: admin.id,
                    username: admin.username,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
            const userAgent = req.headers["user-agent"];

            const result = await this.authService.login(username, password, ipAddress, userAgent);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;

            if (!adminId) {
                throw AppError.unauthorized("User not authenticated");
            }

            // Clear tokens in DB
            await this.authRepository.updateAdminTokens(adminId, "", "");

            // Find and close latest login history session
            const latestHistory = await this.authRepository.getLatestLoginHistory(adminId);
            if (latestHistory) {
                await this.authRepository.updateLogoutTime(latestHistory.id);
            }

            res.json({ message: "Logout successful" });
        } catch (error) {
            next(error);
        }
    };
}
