import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
