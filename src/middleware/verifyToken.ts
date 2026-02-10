import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface MyJwtPayload extends JwtPayload {
  userId: number;
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Authorization header missing or invalid",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if (typeof decoded === "string") {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    const payload = decoded as MyJwtPayload;

    (req as any).user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
