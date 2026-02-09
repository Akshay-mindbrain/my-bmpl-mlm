import {
  findById,
  findByMobile,
  storeRefreshToken,
} from "@/data/repositories/Auth.user.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/generatetoken";
import { MyJwtPayload } from "@/middleware/verifyToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginServices = async (mobile: string, password: string) => {
  const user = await findByMobile(mobile);
  if (!user) throw new Error("User not found");
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) throw new Error("User not found");
  const acessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);
  await storeRefreshToken(user.id, refreshToken);
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

  const user = await findById(payload.userId);

  if (!user || user.refresh_token !== refreshToken) {
    throw new Error("Invalid refresh token");
  }
  return generateAccessToken(user.id);
};
