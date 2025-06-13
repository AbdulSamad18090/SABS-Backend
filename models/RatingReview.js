const { Model } = require("objection");

Model.knex(require("../db/index"));

class RatingReview extends Model {
  static get tableName() {
    return "ratings_reviews";
  }

  static get relationMappings() {
    const User = require("./User");

    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "ratings_reviews.patient_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = RatingReview;
