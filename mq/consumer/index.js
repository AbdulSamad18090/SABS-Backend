// mq/consumer.js
const { UniqueViolationError } = require('objection');
const Appointment = require("../../models/Appointment");
const { getChannel } = require("../connection");

const consumeAppointments = async () => {
  const channel = getChannel();
  if (!channel) throw new Error("Channel not ready");

  channel.prefetch(1);

  channel.consume("appointment-queue", async (msg) => {
    if (!msg) return;

    let data;

    try {
      data = JSON.parse(msg.content.toString());
      const newAppointment = await Appointment.query().insert(data);
      console.log("✅ Appointment saved:", newAppointment);
      channel.ack(msg);
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        console.log("⚠️ Duplicate appointment time:", data?.appointment_at);
        channel.ack(msg);
      } else {
        console.error("❌ Unexpected DB error:", error);
        channel.nack(msg, false, true);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
};

module.exports = { consumeAppointments };
