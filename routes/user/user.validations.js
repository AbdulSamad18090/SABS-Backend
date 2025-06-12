const Joi = require("joi");

const userValidationSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  role: Joi.string().required(),
});

const updateUserValidationSchema = Joi.object({
  id: Joi.string().required(),
  full_name: Joi.string().min(3).max(100).required(),
  profile_image: Joi.string(),
  phone_number: Joi.string(),
  bio: Joi.string(),
  specialization: Joi.string(),
  university: Joi.string(),
  graduation_year: Joi.number(),
  experience: Joi.number(),
  address: Joi.string(),
  medical_license: Joi.string(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

module.exports = {
  userValidationSchema,
  updateUserValidationSchema,
  loginValidationSchema,
};
