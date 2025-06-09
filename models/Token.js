const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class Token extends Model {
  static get tableName() {
    return "tokens";
  }
}

module.exports = Token;
