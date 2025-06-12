const Joi = require("joi");

const userValidationSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  role: Joi.string().required(),
});

const updateDoctorValidationSchema = Joi.object({
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

const updatePatientValidationSchema = Joi.object({
  id: Joi.string().required(),
  address: Joi.string().optional().allow(null, ""),
  age: Joi.number().optional().allow(null),
  blood_group: Joi.string().optional().allow(null, ""),
  emergency_contact: Joi.number().optional().allow(null),
  full_name: Joi.string().optional().allow(null, ""),
  phone_number: Joi.number().optional().allow(null),
  problem: Joi.string().optional().allow(null, ""),
  profile_image: Joi.string().optional().allow(null, ""),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

module.exports = {
  userValidationSchema,
  updateDoctorValidationSchema,
  updatePatientValidationSchema,
  loginValidationSchema,
};
