import Joi from "joi";
export const adminRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).required(),

  lastName: Joi.string().min(2).required(),

  email: Joi.string().email().required(),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
    }),

  password: Joi.string().min(6).required(),
});
