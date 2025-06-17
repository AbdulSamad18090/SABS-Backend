const Slot = require("../../models/Slot");

const createSlot = async (slotsArray) => {
  await Slot.query().delete().where("doctor_id", slotsArray[0]?.doctor_id);
  const newSlots = await Slot.query().insert(slotsArray);
  return newSlots;
};

const getSchedule = async (doctorId) => {
  const schedule = await Slot.query().where("doctor_id", doctorId);
  return schedule;
};

module.exports = {
  createSlot,
  getSchedule,
};
