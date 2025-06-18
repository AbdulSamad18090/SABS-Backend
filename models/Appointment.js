const { Model } = require("objection");

const db = require("../db/index");
const User = require("./User");

Model.knex(db);

class Appointment extends Model {
  static get tableName() {
    return "appointments";
  }

  static get relationMappings() {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "appointments.patient_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Appointment;
