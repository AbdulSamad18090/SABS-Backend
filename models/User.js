const { Model } = require("objection");
const DoctorProfile = require("./DoctorProfile");
const PatientProfile = require("./PatientProfile");
const RatingsReviews = require("./RatingReview");
const Slot = require("./Slot");

const db = require("../db/index");

Model.knex(db);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      doctorProfile: {
        relation: Model.HasOneRelation,
        modelClass: DoctorProfile,
        join: {
          from: "users.id",
          to: "doctor_profiles.user_id",
        },
      },
      patientProfile: {
        relation: Model.HasOneRelation,
        modelClass: PatientProfile,
        join: {
          from: "users.id",
          to: "patient_profiles.user_id",
        },
      },
      ratingsreviews: {
        relation: Model.HasManyRelation,
        modelClass: RatingsReviews,
        join: {
          from: "users.id",
          to: "ratings_reviews.doctor_id",
        },
      },
      slots: {
        relation: Model.HasManyRelation,
        modelClass: Slot,
        join: {
          from: "users.id",
          to: "slots.doctor_id",
        },
      },
    };
  }

  static get modifiers() {
    return {
      selectReviewStats(builder) {
        builder
          .select("doctor_id")
          .count("id as totalReviews")
          .avg("rating as averageRating")
          .groupBy("doctor_id");
      },
      selectAvailableSlots(builder) {
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
        builder
          .select(
            "doctor_id",
            "slot_date",
            "start_time",
            "end_time",
            "is_booked"
          )
          .where("is_booked", false)
          .where("slot_date", today);
      },
    };
  }
}

module.exports = User;
