const Joi = require("joi");

const userValidationSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  role: Joi.string().required(),
});

const updateUserValidationSchema = Joi.object({
  full_name: Joi.string().min(3).max(100),
  password: Joi.string().min(6).max(12),
});

module.exports = { userValidationSchema, updateUserValidationSchema };
