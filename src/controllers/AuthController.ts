import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";

export default class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
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
}
