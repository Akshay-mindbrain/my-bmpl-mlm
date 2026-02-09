import { Response, NextFunction, Request } from "express";
import * as authService from "../useCase/AuthService";
import { AuthRequest } from "../middleware/authenticate-user";
import AppError from "../errors/AppError";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const admin = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    const result = await authService.login(
      username,
      password,
      ipAddress,
      userAgent,
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const adminId = (req as AuthRequest).user?.id;

    if (!adminId) {
      return next(AppError.unauthorized("You must be logged in to log out."));
    }

    await authService.logout(adminId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
