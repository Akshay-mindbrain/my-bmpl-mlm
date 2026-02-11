import {
  findById,
  findByMobile,
  storeRefreshToken,
} from "@/data/repositories/Auth.admin.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/generatetoken";
import { MyJwtPayload } from "@/middleware/verifyToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginServices = async (mobile: string, password: string) => {
  const Admin = await findByMobile(mobile);
  if (!Admin) throw new Error("User not found");
  const isPassword = await bcrypt.compare(password, Admin.password);
  if (!isPassword) throw new Error("User not found");
  const acessToken = generateAccessToken(Admin.id);
  const refreshToken = generateRefreshToken(Admin.id);
  await storeRefreshToken(Admin.id, refreshToken);
  return {
    acessToken,
    refreshToken,
  };
};

export const genAcessServices = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  const payload = decoded as MyJwtPayload;

  const admin = await findById(payload.adminId);

  if (!admin || admin.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }
  return generateAccessToken(admin.id);
};
