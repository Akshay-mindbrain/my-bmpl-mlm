import { Response, NextFunction } from "express";
import * as userService from "../services/UserService";
import { AuthRequest } from "../middleware/authenticate-user";

export const create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user!.id;
        const adminUsername = req.user!.username;
        const user = await userService.createUser(req.body, adminId, adminUsername);

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user!.id;
        const users = await userService.getUsers(adminId);

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user!.id;
        const user = await userService.getUser(parseInt(req.params.id), adminId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user!.id;
        const adminUsername = req.user!.username;
        const user = await userService.updateUser(
            parseInt(req.params.id),
            req.body,
            adminId,
            adminUsername
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user!.id;
        await userService.deleteUser(parseInt(req.params.id), adminId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};
