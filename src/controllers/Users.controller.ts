import { Request, Response, NextFunction } from "express";
import * as userService from "../useCase/Users.Service";
import { AuthRequest } from "../middleware/authenticate-user";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.updateUser(parseInt(req.params.id),
      req.body,
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

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await userService.deleteUser(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

//Helper Controller
export const getDownline = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const users = await userService.getAllDownlineByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Downline users fetched successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpline = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const users = await userService.getAllUpLineByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Upline users fetched successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getLastNodeByLegController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const legPosition = req.body.legPosition as "LEFT" | "RIGHT";

    if (!userId || !["LEFT", "RIGHT"].includes(legPosition)) {
      res.status(400).json({
        success: false,
        message: "Invalid userId or legPosition",
      });
      return;
    }

    const lastNode = await userService.updateLastNodeByLeg(userId, legPosition);

    if (!lastNode) {
      res.status(404).json({
        success: false,
        message: "No node found for given leg",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lastNode,
    });
  } catch (error) {
    console.error("getLastNodeByLeg error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
