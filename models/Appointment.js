const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class Appointment extends Model {
  static get tableName() {
    return "appointments";
  }
}

module.exports = Appointment;
