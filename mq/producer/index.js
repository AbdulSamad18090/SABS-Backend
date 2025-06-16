// mq/producer.js
const { getChannel } = require("../connection");

const sendAppointmentToQueue = async (data) => {
  const channel = getChannel();
  if (!channel) throw new Error("RabbitMQ channel is not ready");

  channel.sendToQueue("appointment-queue", Buffer.from(JSON.stringify(data)));
};

module.exports = { sendAppointmentToQueue };
