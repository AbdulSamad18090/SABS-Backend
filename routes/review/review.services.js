const RatingReview = require("../../models/RatingReview");

const createReview = async (data) => {
  const newReview = await RatingReview.query().insert(data);
  return newReview;
};

const getReviews = async (doctorId) => {
  return await RatingReview.query()
    .where("doctor_id", doctorId)
    .withGraphFetched(
      "patient(selectNameAndProfile).[patientProfile(selectProfile)]"
    )
    .modifiers({
      selectNameAndProfile(builder) {
        builder.select("id", "full_name");
      },
      selectProfile(builder) {
        builder.select("user_id", "profile_image");
      },
    })
    .orderBy("created_at", "desc");
};

module.exports = {
  createReview,
  getReviews,
};
