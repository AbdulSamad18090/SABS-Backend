const { UniqueViolationError } = require("objection");
const Appointment = require("../../models/Appointment");
const Slot = require("../../models/Slot");
const User = require("../../models/User");
const { getChannel } = require("../connection");
const { sendAppointmentEmail } = require("../../utils/sendEmail");

const consumeAppointments = async () => {
  const channel = getChannel();
  if (!channel) throw new Error("Channel not ready");

  channel.prefetch(1);

  channel.consume("appointment-queue", async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const { patient_id, doctor_id, slot_id, appointment_at, reason } = data;

      if (!patient_id || !doctor_id || !slot_id || !appointment_at) {
        console.error("❌ Missing required appointment fields");
        return channel.ack(msg);
      }

      const newAppointment = await Appointment.query().insert({
        patient_id,
        doctor_id,
        appointment_at,
        reason,
      });

      await Slot.query().patchAndFetchById(slot_id, { is_booked: true });

      const patient = await User.query().findById(patient_id);
      const doctor = await User.query().findById(doctor_id);

      if (patient?.email) {
        await sendAppointmentEmail({
          to: patient.email,
          patient_name: patient?.full_name,
          doctor_name: doctor?.full_name || "Your Doctor",
          appointment_datetime: new Date(appointment_at).toLocaleString(
            "en-PK",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          appointment_reason: reason,
        });

        console.log(`📧 Email sent to ${patient.email}`);
      }

      console.log("✅ Appointment saved:", newAppointment);
      channel.ack(msg);
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        console.warn("⚠️ Duplicate appointment time");
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
