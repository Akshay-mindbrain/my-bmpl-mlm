import { Response, NextFunction, Request } from "express";
import UserService from "../services/UserService";
import { AuthRequest } from "../middleware/authenticate-user";

export default class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;
            const adminUsername = authReq.user?.username;

            if (!adminId || !adminUsername) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const user = await this.userService.createUser(req.body, adminId, adminUsername);
            res.status(201).json({
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;

            if (!adminId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const users = await this.userService.getUsers(adminId);
            res.json({ data: users });
        } catch (error) {
            next(error);
        }
    };

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;
            const { id } = req.params;

            if (!adminId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const user = await this.userService.getUser(Number(id), adminId);
            res.json({ data: user });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;
            const adminUsername = authReq.user?.username;
            const { id } = req.params;

            if (!adminId || !adminUsername) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const user = await this.userService.updateUser(Number(id), req.body, adminId, adminUsername);
            res.json({
                message: "User updated successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthRequest;
            const adminId = authReq.user?.id;
            const { id } = req.params;

            if (!adminId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            await this.userService.deleteUser(Number(id), adminId);
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}
