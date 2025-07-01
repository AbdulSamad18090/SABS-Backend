const Appointment = require("../models/Appointment");
require("../db/index");

const agi = async (channel) => {
  const agiEnv = channel.channelData;

  try {
    const callerPhone = agiEnv.agi_callerid;
    console.log("Incoming call from:", callerPhone);

    // Fetch appointments (you may filter by callerPhone if needed)
    const appointments = await Appointment.query(); // Add a `.where()` if needed

    const count = appointments?.length || 0;
    console.log(`Setting APPOINTMENT_COUNT = ${count}`);

    // Set variable in Asterisk
    await agiEnv.command(`SET VARIABLE APPOINTMENT_COUNT ${count}`);
  } catch (error) {
    console.error("AGI Error:", error);
    await agiEnv.command(`SET VARIABLE APPOINTMENT_COUNT 0`);
  } finally {
    // Return control to dialplan
    agiEnv.close();
  }
};

module.exports = agi;
