const express = require("express");
const validateRequest = require("../../middlewares/validateRequest");
const { createReviewvalidationSchema } = require("./review.validations");
const verifyToken = require("../../middlewares/verifyToken");
const reviewController = require("./review.controller");
const router = express.Router();

router.post(
  "/review/create",
  validateRequest(createReviewvalidationSchema),
  verifyToken,
  /*
  #swagger.tags = ["Rating & Review"]
  #swagger.description = "api route for publishing new review",
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/Review" }
      }
    }
  }
  */
  async (req, res) => {
    const result = await reviewController.createReview(req.body);
    return res.status(result.statusCode).json(result);
  }
);

router.get(
  "/review/get/:id",
  verifyToken,
  /*
  #swagger.tags = ["Rating & Review"]
  #swagger.description = "API route for fetching reviews of specific doctor"
  #swagger.parameters["id"] = {
    in: 'path',
      description: 'ID of the doctor',
      required: true,
      type: 'string'
  }
  */
  async (req, res) => {
    const { id } = req.params;
    const result = await reviewController.getReviews(id);
    return res.status(result.statusCode).json(result);
  }
);

module.exports = router;
