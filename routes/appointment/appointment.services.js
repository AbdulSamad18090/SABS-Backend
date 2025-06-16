const { sendAppointmentToQueue } = require("../../mq/producer");

const bookAppointment = async (data) => {
  await sendAppointmentToQueue(data);
  return data;
};

module.exports = {
  bookAppointment,
};
