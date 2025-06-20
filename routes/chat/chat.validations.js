const Joi = require("joi");

const messageValidationSchema = Joi.object({
  sender_id: Joi.string().uuid().required(),
  receiver_id: Joi.string().uuid().required(),
  message: Joi.string().min(1).required(),
});

module.exports = {
  messageValidationSchema,
};
