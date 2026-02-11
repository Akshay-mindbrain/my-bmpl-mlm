import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (Id: number) => {
  return jwt.sign({ Id }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (Id: number) => {
  return jwt.sign({ Id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
