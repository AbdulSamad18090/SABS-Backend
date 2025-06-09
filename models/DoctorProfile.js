const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class DoctorProfile extends Model {
  static get tableName() {
    return "doctor_profiles";
  }
}

module.exports = DoctorProfile;
