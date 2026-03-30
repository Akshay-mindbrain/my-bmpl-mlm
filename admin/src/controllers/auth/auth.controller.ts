import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "@/errors/AppError";
import {
  genAcessUsecase,
  loginUsecase,
  logoutUsecase,
} from "@/useCase/auth/auth.usecase";
import { createAdminUsecase } from "@/useCase/Admin.services";
import config from "@/config";
import { MyJwtPayload } from "@/middleware/verifyToken";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(AppError.badRequest("Username and password are required"));
    }

    const { accessToken, refreshToken } = await loginUsecase(
      username,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      msg: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
};

export const RegenAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(AppError.unauthorized("Refresh token not found"));
    }

    const accessToken = await genAcessUsecase(token);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      msg: "Access token generated successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Regen Token Error:", error);
    next(error);
  }
};

export const createAdmincontroller = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const admin = await createAdminUsecase(req.body);

    res.status(201).json({
      success: true,
      msg: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return next(AppError.notFound("Token not found"));
    }

    const decode = jwt.verify(
      token,
      config.jwtAccessSecret as string,
    ) as MyJwtPayload;

    const adminId = decode?.id;

    if (!adminId) {
      return next(AppError.notFound("Admin id is required"));
    }

    await logoutUsecase(adminId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      msg: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    next(error);
  }
};
// export const updateAdminController = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);

//     if (isNaN(id)) {
//       throw AppError.notFound("invalid id");
//     }

//     const updatedAdmin: UpdateAdminDTO = await updateAdminUsecase(id, req.body);

//     res.status(200).json({
//       msg: "User updated successfully",
//       updatedAdmin,
//     });
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       res.status(404).json({
//         msg: "Admin not found",
//       });
//       return;
//     }

//     console.error(error);
//     res.status(500).json({
//       msg: "Internal server error",
//     });
//   }
// };

// export const deleteAdminController = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const id = Number(req.params.id);

//     if (!id) {
//       throw AppError.notFound("id is required");
//     }

//     await deleteAdminUsecase(id);
//     res.status(201).json({ msg: "Admin delete  sucessfully" });

//     throw AppError;
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       res.status(404).json({
//         msg: "Admin not found",
//       });
//       return;
//     }

//     res.status(500).json({
//       msg: "Internal server error",
//     });
//   }
// };
