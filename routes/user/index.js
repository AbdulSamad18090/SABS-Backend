const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const validateRequest = require("../../middlewares/validateRequest");
const {
  userValidationSchema,
  updateUserValidationSchema,
} = require("./user.validations");

router.post(
  "/user/create",
  validateRequest(userValidationSchema),
  /*
  #swagger.tags = ["User"]
  #swagger.description = "Payload is required"
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/User" }
      }
    }
  }
  */
  userController.createUser
);

router.get(
  "/user/doctor/get",
  /*
  #swagger.tags = ["User"]
  #swagger.description = "API route to fetch doctors with pagination"
  #swagger.parameters['page'] = {
    in: 'query',
    description: 'Page number (starts at 1)',
    required: false,
    type: 'integer',
    default: 1
  }
  #swagger.parameters['limit'] = {
    in: 'query',
    description: 'Number of doctors per page',
    required: false,
    type: 'integer',
    default: 50
  }
  */
  userController.getDoctors
);

router.put(
  "/user/update/:id",
  validateRequest(updateUserValidationSchema),
  /*
    #swagger.tags = ["User"]
    #swagger.description = "API route for updating a user."
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the user to update',
      required: true,
      type: 'string'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/User" }
        }
      }
    }
  */
  userController.updateUser
);

router.delete(
  "/user/delete/:id",
  /*
    #swagger.tags = ["User"]
    #swagger.description = "API route for account deletion or user deletion."
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the user you want to delete',
      required: true,
      type: 'string'
    }
  */
  userController.deleteUser
);

module.exports = router;
