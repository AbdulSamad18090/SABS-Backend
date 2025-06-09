const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class RatingReview extends Model {
  static get tableName() {
    return "ratings_reviews";
  }
}

module.exports = RatingReview;
