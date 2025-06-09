const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class PatientProfile extends Model {
  static get tableName() {
    return "patient_profiles";
  }
}

module.exports = PatientProfile;
