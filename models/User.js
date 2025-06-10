const { Model } = require("objection");
const DoctorProfile = require("./DoctorProfile");
const PatientProfile = require("./PatientProfile");

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
    };
  }
}

module.exports = User;
