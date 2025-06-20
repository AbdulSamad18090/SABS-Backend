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

const getDoctorAppointments = async (doctorId) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(
      doctorId
    );
    if (!appointments) {
      return {
        success: false,
        statusCode: 400,
        message: "No appointments found",
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Appointments fetched successfully",
      appointments,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch appointments",
      error: error.message,
    };
  }
};

const getPatientAppointments = async (patientId) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(
      patientId
    );
    if (!appointments) {
      return {
        success: false,
        statusCode: 400,
        message: "No appointments found",
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Appointments fetched successfully",
      appointments,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch appointments",
      error: error.message,
    };
  }
};

const cancelAppointment = async (appointmentId) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      appointmentId
    );
    return {
      success: true,
      statusCode: 200,
      message: "Appointment cancelled successfully",
      appointment,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to cancel appointment",
      error: error.message,
    };
  }
};

const completeAppointment = async (appointmentId) => {
  try {
    const appointment = await appointmentService.completeAppointment(
      appointmentId
    );
    return {
      success: true,
      statusCode: 200,
      message: "Appointment completed successfully",
      appointment,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to complete appointment",
      error: error.message,
    };
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  cancelAppointment,
  completeAppointment,
};
