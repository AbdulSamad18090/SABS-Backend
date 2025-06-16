const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class Slot extends Model {
  static get tableName() {
    return "slots";
  }
}

module.exports = Slot;
