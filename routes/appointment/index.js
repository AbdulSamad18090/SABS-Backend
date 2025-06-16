const express = require("express");
const appointmentController = require("./appointment.controller");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");
const {
  appointmentBookingValidationSchema,
} = require("./appointment.validations");
const router = express.Router();

router.post(
  "/appointment/book",
  validateRequest(appointmentBookingValidationSchema),
  verifyToken,
  /*
  #swagger.tags = ["Appointment"]
  #swagger.description = "API route to book an appointment",
  #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/BookAppointment" }
        }
      }
    }
  */
  async (req, res) => {
    const result = await appointmentController.bookAppointment(req.body);
    return res.status(result.statusCode).json(result);
  }
);

module.exports = router;
