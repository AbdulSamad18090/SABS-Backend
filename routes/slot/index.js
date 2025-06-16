const express = require("express");
const router = express.Router();
const slotController = require("./slot.controller");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");
const { saveSlotsArrayValidationSchema } = require("./slot.validations");

router.post(
  "/slots/save",
  validateRequest(saveSlotsArrayValidationSchema),
  verifyToken,
  /*
  #swagger.tags = ["Slots"]
  #swagger.description = "API route for saving slots"
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/SaveSlot" }
      }
    }
  }
  */
  async (req, res) => {
    const result = await slotController.createSlot(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/slots/save",
  validateRequest(saveSlotsArrayValidationSchema),
  verifyToken,
  /*
  #swagger.tags = ["Slots"]
  #swagger.description = "API route for saving slots"
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/SaveSlot" }
      }
    }
  }
  */
  async (req, res) => {
    const result = await slotController.createSlot(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.get(
  "/slots/get-schedule/:id",
  verifyToken,
  /*
  #swagger.tags = ["Slots"]
  #swagger.description = "API route for fetch slots / schedule"
  #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the doctor you want to fetch schedule or availabale slots',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await slotController.getSchedule(id);
    return res.status(result.statusCode).json(result);
  }
);

module.exports = router;
