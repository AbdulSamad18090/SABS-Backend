const agi = (app) => {
  app.agi("/get-appointments", require("./getAppointments.agi"));

  return app;
};

module.exports = agi;
