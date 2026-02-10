import express from "express";

import Joi from "joi";

const router = express.Router();

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  email: Joi.string().email(),
  adminType: Joi.string().valid("SUPERADMIN", "ADMIN", "MANAGER").required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// router.post("/signup", validateRequest(signupSchema), authController.signup);
// router.post("/login", validateRequest(loginSchema), authController.login);
// router.post("/logout", authenticateUser, authController.logout);

// export default router;
