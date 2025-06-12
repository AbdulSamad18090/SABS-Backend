const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const validateRequest = require("../../middlewares/validateRequest");
const {
  userValidationSchema,
  loginValidationSchema,
  updateDoctorValidationSchema,
  updatePatientValidationSchema,
} = require("./user.validations");
const verifyToken = require("../../middlewares/verifyToken");

router.post(
  "/auth/signup",
  validateRequest(userValidationSchema),
  /*
  #swagger.tags = ["Auth"]
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
  async (req, res) => {
    const result = await userController.createUser(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/auth/login",
  validateRequest(loginValidationSchema),
  /*
  #swagger.tags = ["Auth"],
  #swagger.description = "Route for login user"
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/Login" }
      }
    }
  }
  */
  async (req, res) => {
    const result = await userController.loginUser(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.post(
  "/auth/refresh-token",
  /*
  #swagger.tags = ["Auth"]
  #swagger.description = "API route for refreshing the expired access token"
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/RefreshToken" }
      }
    }
  }
  */
  userController.getNewAccessToken
);

router.get(
  "/user/doctor/get",
  verifyToken,
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
  async (req, res) => {
    const result = await userController.getDoctors(req);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/user/doctor/update",
  validateRequest(updateDoctorValidationSchema),
  verifyToken,
  /*
    #swagger.tags = ["User"]
    #swagger.description = "API route for updating a doctor."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/UpdateDoctor" }
        }
      }
    }
  */
  async (req, res) => {
    const result = await userController.updateDoctor(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/user/patient/update",
  validateRequest(updatePatientValidationSchema),
  verifyToken,
  /*
    #swagger.tags = ["User"]
    #swagger.description = "API route for updating a patient."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/UpdatePatient" }
        }
      }
    }
  */
  async (req, res) => {
    const result = await userController.updatePatient(req.body);
    return res.status(result.statusCode).json(result);
  }
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
