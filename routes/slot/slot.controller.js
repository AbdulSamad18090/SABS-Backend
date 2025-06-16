const slotService = require("./slot.services");

const createSlot = async (data) => {
  try {
    const newSlots = await slotService.createSlot(data);
    if (!newSlots) {
      throw new Error("Failed to save slots");
    }
    return {
      success: true,
      statusCode: 200,
      message: "Slots saved successfully",
      slots: newSlots,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to save slots",
      error: error.message,
    };
  }
};

const getSchedule = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        success: false,
        statusCode: 400,
        message: "Doctor id missing",
      };
    }
    const schedule = await slotService.getSchedule(doctorId);
    if (!schedule) {
      return {
        success: false,
        statusCode: 404,
        message: "Schedule not found",
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Schedule fetched successfully",
      schedule,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch schedule",
      error: error.message,
    };
  }
};

module.exports = {
  createSlot,
  getSchedule,
};
