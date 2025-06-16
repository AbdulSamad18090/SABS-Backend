const Appointment = require("../../models/Appointment");
const appointmentService = require("./appointment.services");

const bookAppointment = async (data) => {
  try {
    // Quick availability check before queuing
    const existingAppointment = await Appointment.query()
      .where("appointment_at", data.appointment_at)
      .first();

    if (existingAppointment) {
      return {
        success: false,
        statusCode: 409,
        message:
          "This time slot is already booked. Please choose a different time.",
      };
    }

    await appointmentService.bookAppointment(data);

    return {
      success: true,
      statusCode: 202,
      message:
        "Your appointment request has been received and is being processed.",
    };
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return {
        success: false,
        statusCode: 409,
        message:
          "This time slot is already booked. Please choose a different time.",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to book your appointment. Please try again.",
      error: error.message,
    };
  }
};

module.exports = {
  bookAppointment,
};
