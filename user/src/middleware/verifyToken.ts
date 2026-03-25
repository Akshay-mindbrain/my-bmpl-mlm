import config from "@/config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthUser } from "@/types/express";

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.userAccessToken as string | undefined;

    if (!token) {
      res.status(401).json({ msg: "Authentication cookie missing" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtAccessSecret as string) as {
      id: number;
    };

    res.locals.user = { id: decoded.id };

    next();
  } catch {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
      res.status(401).json({ msg: "Admin authentication cookie missing" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtAccessSecret as string) as {
      id: number;
    };

    res.locals.admin = { id: decoded.id };

    next();
  } catch {
    res.status(401).json({ msg: "Invalid or expired admin token" });
  }
};
