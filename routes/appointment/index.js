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

router.get(
  "/appointment/doctor/:id",
  verifyToken,
  /*
  #swagger.tags = ["Appointment"]
  #swagger.description = "API toute for fetching appointments of perticulat doctor"
   #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the doctor you want to fetch the appointments',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await appointmentController.getDoctorAppointments(id);
    return res.status(result.statusCode).json(result);
  }
);

router.get(
  "/appointment/patient/:id",
  verifyToken,
  /*
  #swagger.tags = ["Appointment"]
  #swagger.description = "API route for fetching appointments of a particular patient"
   #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the patient you want to fetch the appointments',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await appointmentController.getPatientAppointments(id);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/appointment/cancel/:id",
  verifyToken,
  /*
  #swagger.tags = ["Appointment"]
  #swagger.description = "API route to cancel an appointment"
   #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the appointment you want to cancel',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await appointmentController.cancelAppointment(id);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/appointment/complete/:id",
  verifyToken,
  /*
  #swagger.tags = ["Appointment"]
  #swagger.description = "API route to complete an appointment"
   #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the appointment you want to complete',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await appointmentController.completeAppointment(id);
    return res.status(result.statusCode).json(result);
  }
);

module.exports = router;
