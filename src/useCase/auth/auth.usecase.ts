import {
  findById,
  findByMobile,
  storeRefreshToken,
} from "@/data/repositories/Auth.admin.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generatetoken";
import { MyJwtPayload } from "@/middleware/verifyToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginServices = async (username: string, password: string) => {
  const existAdmin = await findByMobile(username);
  if (!existAdmin) {
    throw new Error("user not found");
  }
  const isPassword = await bcrypt.compare(password, existAdmin.password);
  if (!isPassword) {
    throw new Error("credentioal is not match");
  }
  const accessToken = await generateAccessToken(existAdmin.id);
  const refreshToken = await generateRefreshToken(existAdmin.id);
  await storeRefreshToken(existAdmin.id, refreshToken);
  return {
    accessToken,
    refreshToken,
  };
};

export const genAcessServices = async (refreshToken: string) => {
  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    );

    if (!decoded?.id) {
      throw new Error("Invalid token");
    }

    const admin = await findById(decoded.id);

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (admin.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    return generateAccessToken(admin.id);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
