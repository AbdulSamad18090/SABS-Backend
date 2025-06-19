const Appointment = require("../../models/Appointment");
const { sendAppointmentToQueue } = require("../../mq/producer");

const bookAppointment = async (data) => {
  await sendAppointmentToQueue(data);
  return data;
};

const getDoctorAppointments = async (doctorId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 00:00 today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // 00:00 tomorrow

  // 📅 Today's appointments
  const todayAppointments = await Appointment.query()
    .where("doctor_id", doctorId)
    .andWhere("appointment_at", ">=", today)
    .andWhere("appointment_at", "<", tomorrow)
    .withGraphFetched("patient.[patientProfile]")
    .orderBy("appointment_at", "asc");

  // 📆 Upcoming appointments
  const upcomingAppointments = await Appointment.query()
    .where("doctor_id", doctorId)
    .andWhere("appointment_at", ">=", tomorrow)
    .withGraphFetched("patient.[patientProfile]")
    .orderBy("appointment_at", "asc");

  return {
    todayAppointments,
    upcomingAppointments,
  };
};

const cancelAppointment = async (appointmentId) => {
  const appointment = await Appointment.query().patchAndFetchById(
    appointmentId,
    {
      status: "cancelled",
    }
  );
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  return appointment;
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  cancelAppointment,
};
