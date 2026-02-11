import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface MyJwtPayload extends JwtPayload {
  Id: number;
}

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({
        msg: "Authorization header missing or invalid",
      });
      return;
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if (typeof decoded === "string") {
      res.status(401).json({ msg: "Invalid token payload" });
      return;
    }

    const payload = decoded as MyJwtPayload;

    (req as any).user = payload;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
    return;
  }
};
