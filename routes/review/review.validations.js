const Joi = require("joi");

const createReviewvalidationSchema = Joi.object({
  doctor_id: Joi.string().required(),
  patient_id: Joi.string().required(),
  rating: Joi.number().required(),
  review: Joi.string().required(),
});

module.exports = {
  createReviewvalidationSchema,
};
