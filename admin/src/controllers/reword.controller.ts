import AppError from "@/errors/AppError";
import {
  rewardhistoryHistryusecase,
  rewardUsecase,
} from "@/useCase/rewards.usecase";
import { Request, Response, NextFunction } from "express";
export const rewardcontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reward = await rewardUsecase();

    res.status(200).json({
      success: true,
      msg: "Reward fetched successfully",
      data: reward,
    });
  } catch (error) {
    console.error("Reward Error:", error);
    next(error);
  }
};

export const getrewardcontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reward = await rewardhistoryHistryusecase();

    res.status(200).json({
      success: true,
      msg: "Reward history fetched successfully",
      data: reward,
    });
  } catch (error) {
    console.error("Reward History Error:", error);
    next(error);
  }
};
