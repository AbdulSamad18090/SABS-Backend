const express = require("express");
const chatController = require("./chat.controller");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");
const { messageValidationSchema } = require("./chat.validations");
const router = express.Router();

router.post(
  "/chat/send-message",
  validateRequest(messageValidationSchema),
  verifyToken,
  /*
  #swagger.tags = ['Chat']
  #swagger.description = 'Send a message in the chat'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/ChatMessage" }
      }
    }
  }
  */
  async (req, res) => {
    const result = await chatController.sendMessage(req.body, req.io);
    return res.status(result.statusCode).json(result);
  }
);

router.get(
  "/chat/fetch-messages/:id",
  verifyToken,
  /*
  #swagger.tags = ['Chat']
  #swagger.description = 'Fetch messages for a specific appointment'
  #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the appointment to fetch messages for',
      required: true,
      type: 'string'
    }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await chatController.fetchAppointmentMessages(id);
    return res.status(result.statusCode).json(result);
  }
);

module.exports = router;
