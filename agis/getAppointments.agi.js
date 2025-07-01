const Appointment = require("../models/Appointment");
const PatientProfile = require("../models/PatientProfile");
require("../db/index");

const agi = async (channel) => {
  const agiEnv = channel.channelData;

  try {
    const callerPhone = agiEnv.agi_callerid;
    console.log("Incoming call from:", callerPhone);

    const patientProfile = await PatientProfile.query().findOne(
      "phone_number",
      callerPhone
    );
    if (patientProfile) {
      console.log("Patient profile found:", patientProfile);

      // Fetch appointments (you may filter by callerPhone if needed)
      const appointments = await Appointment.query().where(
        "patient_id",
        patientProfile.user_id
      );

      const count = appointments?.length || 0;
      console.log(`Setting APPOINTMENT_COUNT = ${count}`);

      // Set variable in Asterisk
      await agiEnv.command(`SET VARIABLE APPOINTMENT_COUNT ${count}`);
    } else {
      console.log("No patient profile found for caller:", callerPhone);
      await agiEnv.command(`SET VARIABLE APPOINTMENT_COUNT 0`);
    }
  } catch (error) {
    console.error("AGI Error:", error);
    await agiEnv.command(`SET VARIABLE APPOINTMENT_COUNT 0`);
  } finally {
    // Return control to dialplan
    agiEnv.close();
  }
};

module.exports = agi;
