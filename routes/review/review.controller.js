const reviewService = require("./review.services");

const createReview = async (body) => {
  try {
    const newReview = await reviewService.createReview(body);
    if (!newReview) {
      return {
        success: false,
        statusCode: 400,
        message: "Failed to publish your review",
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Review published successfully",
      review: newReview,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "You aready published your review for this doctor",
      error: error.message,
    };
  }
};

const getReviews = async (doctorId) => {
  try {
    const reviews = await reviewService.getReviews(doctorId);
    if (!reviews || reviews.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "No reviews found",
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Reviews fetched successfully",
      reviews,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch reviews",
      error: error.message,
    };
  }
};

module.exports = {
  createReview,
  getReviews,
};
