import { Request, Response } from "express";
import { loginServices } from "@/useCase/auth/auth.usecase";
import { genAcessServices } from "@/useCase/auth/auth.usecase";
import { loginDto } from "@/dto";

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data: loginDto = req.body;

    if (!data.username || !data.password) {
      res.status(400).json({
        msg: "Required all fields",
      });
      return;
    }
    const { accessToken, refreshToken } = await loginServices(
      data.username,
      data.password,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      msg: "Login successful",
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const genAccessToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({
        msg: "Refresh token missing",
      });
      return;
    }

    const accessToken = await genAcessServices(token);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      msg: "Access token generated successfully",
      accessToken,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
