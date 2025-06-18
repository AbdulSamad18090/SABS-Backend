const Joi = require("joi");

const appointmentBookingValidationSchema = Joi.object({
  patient_id: Joi.string().uuid().required(),
  doctor_id: Joi.string().uuid().required(),
  slot_id: Joi.string().uuid().required(),
  appointment_at: Joi.date().greater("now").required(),
  reason: Joi.string().min(5).max(500).required(),
});

module.exports = {
  appointmentBookingValidationSchema,
};
