const Joi = require("joi");

const saveSlotsValidationSchema = Joi.object({
  doctor_id: Joi.string().uuid().required(),
  end_time: Joi.string().required(),
  start_time: Joi.string().required(),
  slot_date: Joi.date().required(),
  title: Joi.string().required(),
});

const saveSlotsArrayValidationSchema = Joi.array().items(saveSlotsValidationSchema);

module.exports = {
  saveSlotsArrayValidationSchema,
};
