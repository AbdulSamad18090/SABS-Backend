const { Model } = require("objection");

const db = require("../db/index");

Model.knex(db);

class Slot extends Model {
  static get tableName() {
    return "slots";
  }

  static get modifiers() {
    return {
      selectAvailableSlots(builder) {
        const today = new Date().toISOString().split("T")[0].toString(); // 'YYYY-MM-DD'
        builder
          .select(
            "doctor_id",
            "slot_date",
            "start_time",
            "end_time",
            "is_booked",
            "title"
          )
          .where("is_booked", false)
          .where("slot_date", ">=", today);
      },
    };
  }
}

module.exports = Slot;
