import { Request, Response, NextFunction } from "express";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { mobileNumber, password } = req.body;
    // Simulate login logic
    if (!mobileNumber || !password) {
      throw new Error("Missing mobile number or password");
    }
    if (mobileNumber !== "1234567890" || password !== "password") {
      throw new Error("Invalid mobile number or password");
    }
    res.json({ message: "Login successful", mobileNumber });
  } catch (error) {
    next(error);
  }
};

export default login;
